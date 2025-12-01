import { supabase } from './supabase'

/**
 * Sube una imagen a Supabase Storage
 * @param file - Archivo de imagen (PNG, JPEG, WEBP)
 * @param folder - Carpeta donde guardar (opcional)
 * @returns URL pública de la imagen o null si hay error
 */
export async function uploadProductImage(
  file: File,
  folder: string = 'productos'
): Promise<string | null> {
  try {
    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo PNG, JPEG y WEBP.')
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es muy grande. Máximo 5MB.')
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('productos-imagenes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('productos-imagenes')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    throw error
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param imageUrl - URL de la imagen a eliminar
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    // Extraer el path de la URL
    const urlParts = imageUrl.split('productos-imagenes/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('productos-imagenes')
      .remove([filePath])

    if (error) throw error
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error)
    // No lanzar error para no bloquear otras operaciones
  }
}

/**
 * Valida si un archivo es una imagen válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo PNG, JPEG y WEBP.',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es muy grande. Máximo 5MB.',
    }
  }

  return { valid: true }
}

