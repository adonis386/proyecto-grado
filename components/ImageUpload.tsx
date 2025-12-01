'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { validateImageFile } from '@/lib/upload-image'

interface ImageUploadProps {
  currentImage?: string | null
  onImageSelected: (file: File | null) => void
  onImageUrlChanged?: (url: string | null) => void
  onImageRemoved?: () => void
}

export default function ImageUpload({
  currentImage,
  onImageSelected,
  onImageUrlChanged,
  onImageRemoved,
}: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido')
      return
    }

    setError(null)

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Pasar archivo al componente padre
    onImageSelected(file)
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    setError(null)
    
    if (url.trim()) {
      // Validar que sea una URL válida
      try {
        new URL(url)
        setPreview(url)
        if (onImageUrlChanged) {
          onImageUrlChanged(url)
        }
        // Limpiar archivo seleccionado
        onImageSelected(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch {
        setError('URL de imagen inválida')
        setPreview(null)
      }
    } else {
      setPreview(currentImage || null)
      if (onImageUrlChanged) {
        onImageUrlChanged(null)
      }
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setError(null)
    setImageUrl('')
    onImageSelected(null)
    if (onImageUrlChanged) {
      onImageUrlChanged(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onImageRemoved) {
      onImageRemoved()
    }
  }

  const switchMethod = (method: 'file' | 'url') => {
    setUploadMethod(method)
    setError(null)
    // Limpiar el otro método al cambiar
    if (method === 'file') {
      setImageUrl('')
      if (onImageUrlChanged) {
        onImageUrlChanged(null)
      }
    } else {
      onImageSelected(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Imagen del Producto (Opcional)</label>
        
        {/* Tabs para elegir método */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => switchMethod('file')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              uploadMethod === 'file'
                ? 'bg-inn-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📤 Subir Archivo
          </button>
          <button
            type="button"
            onClick={() => switchMethod('url')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              uploadMethod === 'url'
                ? 'bg-inn-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔗 URL de Imagen
          </button>
        </div>

        {/* Opción de subir archivo */}
        {uploadMethod === 'file' && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Formatos: PNG, JPEG, WEBP • Máximo: 5MB
            </p>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-secondary cursor-pointer inline-flex items-center"
              >
                📷 Seleccionar Imagen
              </label>

              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </>
        )}

        {/* Opción de URL */}
        {uploadMethod === 'url' && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Ingresa la URL completa de la imagen (ej: https://ejemplo.com/imagen.jpg)
            </p>
            <div className="space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="input-field"
              />
              {preview && imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  🗑️ Eliminar URL
                </button>
              )}
            </div>
          </>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-2">❌ {error}</p>
        )}
      </div>

      {/* Vista previa */}
      {preview && (
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
          <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

