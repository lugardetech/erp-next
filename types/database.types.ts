export interface Database {
  public: {
    Tables: {
      produtos: {
        Row: {
          categoria_id: number | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          estoque: number | null
          fornecedor_id: number | null
          id: number
          imagem: string | null
          nome: string
          preco: number | null
          sku: string
          subcategoria_id: number | null
        }
        Insert: {
          categoria_id?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          estoque?: number | null
          fornecedor_id?: number | null
          id?: never
          imagem?: string | null
          nome: string
          preco?: number | null
          sku: string
          subcategoria_id?: number | null
        }
        Update: {
          categoria_id?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          estoque?: number | null
          fornecedor_id?: number | null
          id?: never
          imagem?: string | null
          nome?: string
          preco?: number | null
          sku?: string
          subcategoria_id?: number | null
        }
      }
      categorias: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: never
          nome: string
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: never
          nome?: string
        }
      }
      subcategorias: {
        Row: {
          categoria_id: number | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          categoria_id?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: never
          nome: string
        }
        Update: {
          categoria_id?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: never
          nome?: string
        }
      }
    }
  }
}

export type Produto = Database['public']['Tables']['produtos']['Row']
export type ProdutoInsert = Database['public']['Tables']['produtos']['Insert']
export type ProdutoUpdate = Database['public']['Tables']['produtos']['Update']

export type Categoria = Database['public']['Tables']['categorias']['Row']
export type CategoriaInsert = Database['public']['Tables']['categorias']['Insert']
export type CategoriaUpdate = Database['public']['Tables']['categorias']['Update']

export type Subcategoria = Database['public']['Tables']['subcategorias']['Row']
export type SubcategoriaInsert = Database['public']['Tables']['subcategorias']['Insert']
export type SubcategoriaUpdate = Database['public']['Tables']['subcategorias']['Update']

