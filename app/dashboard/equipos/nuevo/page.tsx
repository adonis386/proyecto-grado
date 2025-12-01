'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { DEPARTAMENTOS, UBICACIONES, RACKS_PREDEFINIDOS, MARCAS_COMPONENTES, MODELOS_POR_MARCA } from '@/lib/opciones-formularios'

type ComponenteForm = {
  tipo: 'CPU' | 'Monitor' | 'Teclado' | 'Mouse' | ''
  marca: string
  modelo: string
  numero_serie: string
  placa: string
  marcaCustom: boolean
  modeloCustom: boolean
}

export default function NuevoEquipoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [usuariosExistentes, setUsuariosExistentes] = useState<string[]>([])
  const [racksExistentes, setRacksExistentes] = useState<string[]>([])
  const [usuarioCustom, setUsuarioCustom] = useState(false)
  const [rackCustom, setRackCustom] = useState(false)
  
  const [formData, setFormData] = useState({
    numero_equipo: '',
    usuario_asignado: '',
    estado: 'Operativo',
    ubicacion: 'Oficina Principal',
    departamento: 'Informática',
    rack: '',
    observaciones: '',
  })
  const [componentes, setComponentes] = useState<ComponenteForm[]>([
    { tipo: 'CPU', marca: '', modelo: '', numero_serie: '', placa: '', marcaCustom: false, modeloCustom: false },
    { tipo: 'Monitor', marca: '', modelo: '', numero_serie: '', placa: '', marcaCustom: false, modeloCustom: false },
    { tipo: 'Teclado', marca: '', modelo: '', numero_serie: '', placa: '', marcaCustom: false, modeloCustom: false },
    { tipo: 'Mouse', marca: '', modelo: '', numero_serie: '', placa: '', marcaCustom: false, modeloCustom: false },
  ])

  useEffect(() => {
    loadOpciones()
  }, [])

  async function loadOpciones() {
    try {
      // Cargar usuarios existentes
      const { data: equipos } = await supabase
        .from('equipos')
        .select('usuario_asignado')
        .not('usuario_asignado', 'is', null)
      
      const usuarios = Array.from(new Set(equipos?.map(e => e.usuario_asignado).filter(Boolean) as string[]))
      setUsuariosExistentes(usuarios)

      // Cargar racks existentes
      const { data: racks } = await supabase
        .from('equipos')
        .select('rack')
        .not('rack', 'is', null)
      
      const racksUnicos = Array.from(new Set(racks?.map(r => r.rack).filter(Boolean) as string[]))
      setRacksExistentes(racksUnicos)
    } catch (error) {
      console.error('Error cargando opciones:', error)
    }
  }

  function updateComponente(index: number, field: keyof ComponenteForm, value: string | boolean) {
    const nuevos = [...componentes]
    nuevos[index] = { ...nuevos[index], [field]: value }
    
    // Si cambia la marca, resetear modelo y cargar modelos de esa marca
    if (field === 'marca' && typeof value === 'string') {
      nuevos[index].modelo = ''
      nuevos[index].modeloCustom = false
    }
    
    setComponentes(nuevos)
  }

  function getModelosDisponibles(marca: string, tipo: string): string[] {
    if (!marca || marca === 'Otro') return []
    return MODELOS_POR_MARCA[marca] || []
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Crear el equipo
      const { data: equipo, error: equipoError } = await supabase
        .from('equipos')
        .insert([{
          numero_equipo: parseInt(formData.numero_equipo),
          usuario_asignado: formData.usuario_asignado || null,
          estado: formData.estado,
          ubicacion: formData.ubicacion,
          departamento: formData.departamento,
          rack: formData.rack || null,
          observaciones: formData.observaciones || null,
        }])
        .select()
        .single()

      if (equipoError) throw equipoError

      // Crear componentes
      const componentesParaInsertar = componentes
        .filter(c => c.tipo !== '') // Solo los que tienen tipo
        .map(c => ({
          equipo_id: equipo.id,
          tipo: c.tipo,
          marca: c.marca || null,
          modelo: c.modelo || null,
          numero_serie: c.numero_serie || null,
          placa: c.placa || null,
        }))

      if (componentesParaInsertar.length > 0) {
        const { error: componentesError } = await supabase
          .from('componentes')
          .insert(componentesParaInsertar)

        if (componentesError) throw componentesError
      }

      toast.success('Equipo creado correctamente')
      router.push('/dashboard/equipos')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear equipo')
    } finally {
      setLoading(false)
    }
  }

  const todosLosRacks = [...RACKS_PREDEFINIDOS, ...racksExistentes.filter(r => !RACKS_PREDEFINIDOS.includes(r))]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Equipo</h1>
        <p className="text-gray-600">Registra un nuevo equipo completo con sus componentes</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="card">
          {/* Información del Equipo */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Equipo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Número de Equipo *</label>
                <input
                  type="number"
                  value={formData.numero_equipo}
                  onChange={(e) => setFormData({ ...formData, numero_equipo: e.target.value })}
                  required
                  className="input-field"
                  placeholder="1, 2, 3..."
                  min="1"
                />
              </div>

              <div>
                <label className="label">Usuario Asignado</label>
                {!usuarioCustom ? (
                  <select
                    value={formData.usuario_asignado}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setUsuarioCustom(true)
                        setFormData({ ...formData, usuario_asignado: '' })
                      } else {
                        setFormData({ ...formData, usuario_asignado: e.target.value })
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Sin asignar</option>
                    {usuariosExistentes.map((usuario) => (
                      <option key={usuario} value={usuario}>{usuario}</option>
                    ))}
                    <option value="__custom__">➕ Agregar nuevo usuario</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.usuario_asignado}
                      onChange={(e) => setFormData({ ...formData, usuario_asignado: e.target.value })}
                      className="input-field flex-1"
                      placeholder="Nombre del usuario"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUsuarioCustom(false)
                        setFormData({ ...formData, usuario_asignado: '' })
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Estado *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Disponible">Disponible</option>
                  <option value="No Operativo">No Operativo</option>
                  <option value="En Reparación">En Reparación</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                </select>
              </div>

              <div>
                <label className="label">Ubicación</label>
                <select
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  className="input-field"
                >
                  {UBICACIONES.map((ubicacion) => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Departamento</label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="input-field"
                >
                  {DEPARTAMENTOS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Rack / Punto de Conexión</label>
                {!rackCustom ? (
                  <select
                    value={formData.rack}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setRackCustom(true)
                        setFormData({ ...formData, rack: '' })
                      } else {
                        setFormData({ ...formData, rack: e.target.value })
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Sin rack</option>
                    {todosLosRacks.map((rack) => (
                      <option key={rack} value={rack}>{rack}</option>
                    ))}
                    <option value="__custom__">➕ Agregar nuevo rack</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.rack}
                      onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                      className="input-field flex-1"
                      placeholder="Ej: Rack-01, Rack-A, Switch-01"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRackCustom(false)
                        setFormData({ ...formData, rack: '' })
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Rack o punto de conexión de red donde está conectado el equipo
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="label">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Notas adicionales sobre el equipo..."
                />
              </div>
            </div>
          </div>

          {/* Componentes */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Componentes del Equipo</h2>
            <div className="space-y-6">
              {componentes.map((comp, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">{comp.tipo}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Marca</label>
                      {!comp.marcaCustom ? (
                        <select
                          value={comp.marca}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              updateComponente(index, 'marcaCustom', true)
                              updateComponente(index, 'marca', '')
                            } else {
                              updateComponente(index, 'marca', e.target.value)
                            }
                          }}
                          className="input-field"
                        >
                          <option value="">Sin marca</option>
                          {MARCAS_COMPONENTES[comp.tipo as keyof typeof MARCAS_COMPONENTES]?.map((marca) => (
                            <option key={marca} value={marca}>{marca}</option>
                          ))}
                          <option value="__custom__">➕ Otra marca</option>
                        </select>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={comp.marca}
                            onChange={(e) => updateComponente(index, 'marca', e.target.value)}
                            className="input-field flex-1"
                            placeholder="Escribir marca"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateComponente(index, 'marcaCustom', false)
                              updateComponente(index, 'marca', '')
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="label">Modelo</label>
                      {!comp.modeloCustom ? (
                        <select
                          value={comp.modelo}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              updateComponente(index, 'modeloCustom', true)
                              updateComponente(index, 'modelo', '')
                            } else {
                              updateComponente(index, 'modelo', e.target.value)
                            }
                          }}
                          className="input-field"
                          disabled={!comp.marca || comp.marca === 'Otro'}
                        >
                          <option value="">Sin modelo</option>
                          {getModelosDisponibles(comp.marca, comp.tipo).map((modelo) => (
                            <option key={modelo} value={modelo}>{modelo}</option>
                          ))}
                          {comp.marca && comp.marca !== 'Otro' && (
                            <option value="__custom__">➕ Otro modelo</option>
                          )}
                        </select>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={comp.modelo}
                            onChange={(e) => updateComponente(index, 'modelo', e.target.value)}
                            className="input-field flex-1"
                            placeholder="Escribir modelo"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateComponente(index, 'modeloCustom', false)
                              updateComponente(index, 'modelo', '')
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="label">Número de Serie</label>
                      <input
                        type="text"
                        value={comp.numero_serie}
                        onChange={(e) => updateComponente(index, 'numero_serie', e.target.value)}
                        className="input-field"
                        placeholder="Ej: A000877892"
                      />
                    </div>
                    <div>
                      <label className="label">Placa</label>
                      <input
                        type="text"
                        value={comp.placa}
                        onChange={(e) => updateComponente(index, 'placa', e.target.value)}
                        className="input-field"
                        placeholder="Ej: 01-32385"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Crear Equipo'}
            </button>
            <Link href="/dashboard/equipos" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
