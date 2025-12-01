import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          categoria_id: string
          marca: string | null
          modelo: string | null
          numero_serie: string | null
          estado: string
          ubicacion: string | null
          fecha_adquisicion: string | null
          precio: number | null
          imagen_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          categoria_id: string
          marca?: string | null
          modelo?: string | null
          numero_serie?: string | null
          estado?: string
          ubicacion?: string | null
          fecha_adquisicion?: string | null
          precio?: number | null
          imagen_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          categoria_id?: string
          marca?: string | null
          modelo?: string | null
          numero_serie?: string | null
          estado?: string
          ubicacion?: string | null
          fecha_adquisicion?: string | null
          precio?: number | null
          imagen_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

