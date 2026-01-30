'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { DEPARTAMENTOS, RACKS_PREDEFINIDOS } from '@/lib/opciones-formularios'
import { ROLES_EMPLEADO } from '@/lib/supabase-empleados'
import { useRolContext } from '@/lib/rol-context'

export default function EditarEmpleadoPage() {
  const params = useParams()
  const router = useRouter()
  const { canManageEmpleados } = useRolContext()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [rackCustom, setRackCustom] = useState(false)
  const [racksExistentes, setRacksExistentes] = useState<string[]>([])

  const [formData, setFormData] = useState({
    nombre_completo: '',
    cargo: '',
    email: '',
    telefono: '',
    direccion_ip: '',
    acceso_internet: true,
    acceso_llamadas: true,
    rack: '',
    departamento: 'Informática',
    rol: 'Empleado',
    activo: true,
    observaciones: '',
  })

  useEffect(() => {
    if (!canManageEmpleados) {
      router.replace(`/dashboard/empleados/${params.id}`)
      return
    }
    loadRacks()
    loadEmpleado()
  }, [params.id, canManageEmpleados, router])

  async function loadRacks() {
    const { data } = await supabase.from('equipos').select('rack').not('rack', 'is', null)
    const racks = Array.from(new Set(data?.map((r) => r.rack).filter(Boolean) as string[]))
    setRacksExistentes(racks)
  }

  async function loadEmpleado() {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Empleado no encontrado')

      setFormData({
        nombre_completo: data.nombre_completo || '',
        cargo: data.cargo || '',
        email: data.email || '',
        telefono: data.telefono || '',
        direccion_ip: data.direccion_ip || '',
        acceso_internet: data.acceso_internet ?? true,
        acceso_llamadas: data.acceso_llamadas ?? true,
        rack: data.rack || '',
        departamento: data.departamento || 'Informática',
        rol: data.rol || 'Empleado',
        activo: data.activo ?? true,
        observaciones: data.observaciones || '',
      })

      if (data.rack && !RACKS_PREDEFINIDOS.includes(data.rack)) {
        setRackCustom(true)
      }
    } catch (error: any) {
      toast.error('Error al cargar empleado')
      router.push('/dashboard/empleados')
    } finally {
      setLoadingData(false)
    }
  }

  const todosLosRacks = [...RACKS_PREDEFINIDOS, ...racksExistentes.filter((r) => !RACKS_PREDEFINIDOS.includes(r))]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('empleados')
        .update({
          nombre_completo: formData.nombre_completo.trim(),
          cargo: formData.cargo.trim() || null,
          email: formData.email.trim() || null,
          telefono: formData.telefono.trim() || null,
          direccion_ip: formData.direccion_ip.trim() || null,
          acceso_internet: formData.acceso_internet,
          acceso_llamadas: formData.acceso_llamadas,
          rack: formData.rack.trim() || null,
          departamento: formData.departamento,
          rol: formData.rol,
          activo: formData.activo,
          observaciones: formData.observaciones.trim() || null,
        })
        .eq('id', params.id)

      if (error) throw error
      toast.success('Empleado actualizado correctamente')
      router.push(`/dashboard/empleados/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar empleado')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) return <div className="text-center py-12">Cargando...</div>

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/empleados/${params.id}`}
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver al Empleado
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Empleado</h1>
        <p className="text-gray-600">Actualiza la información del empleado</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            <div>
              <label className="label">Nombre completo *</label>
              <input
                type="text"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Cargo</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="input-field"
                >
                  {ROLES_EMPLEADO.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conectividad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Dirección IP</label>
                  <input
                    type="text"
                    value={formData.direccion_ip}
                    onChange={(e) => setFormData({ ...formData, direccion_ip: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Rack</label>
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
                      {todosLosRacks.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
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
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceso_internet}
                      onChange={(e) => setFormData({ ...formData, acceso_internet: e.target.checked })}
                      className="rounded"
                    />
                    <span>Acceso a internet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceso_llamadas}
                      onChange={(e) => setFormData({ ...formData, acceso_llamadas: e.target.checked })}
                      className="rounded"
                    />
                    <span>Acceso a llamadas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="rounded"
                    />
                    <span>Activo</span>
                  </label>
                </div>
                <div>
                  <label className="label">Departamento</label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className="input-field"
                  >
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
            <Link href={`/dashboard/empleados/${params.id}`} className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
