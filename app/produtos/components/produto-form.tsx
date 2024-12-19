'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabaseClient'
import { Produto, ProdutoInsert, ProdutoUpdate, Categoria, Subcategoria } from '@/types/database.types'

export function ProdutoForm({ produto }: { produto?: Produto }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProdutoInsert>({
    nome: '',
    preco: 0,
    estoque: 0,
    sku: '',
    categoria_id: null,
    subcategoria_id: null,
    descricao: '',
    fornecedor_id: null,
    imagem: null,
  })

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])

  useEffect(() => {
    fetchCategorias()
    if (produto) {
      setFormData(produto)
      if (produto.categoria_id) {
        fetchSubcategorias(produto.categoria_id)
      }
    }
  }, [produto])

  const fetchCategorias = async () => {
    const { data: categoriasData, error: categoriasError } = await supabase
      .from('categorias')
      .select('*')
    
    if (categoriasError) {
      console.error('Erro ao buscar categorias:', categoriasError)
    } else {
      setCategorias(categoriasData || [])
    }
  }

  const fetchSubcategorias = async (categoriaId: number) => {
    const { data: subcategoriasData, error: subcategoriasError } = await supabase
      .from('subcategorias')
      .select('*')
      .eq('categoria_id', categoriaId)
    
    if (subcategoriasError) {
      console.error('Erro ao buscar subcategorias:', subcategoriasError)
    } else {
      setSubcategorias(subcategoriasData || [])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoriaChange = (value: string) => {
    const categoriaId = Number(value)
    setFormData(prev => ({ ...prev, categoria_id: categoriaId, subcategoria_id: null }))
    fetchSubcategorias(categoriaId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSubmit: ProdutoInsert | ProdutoUpdate = {
        ...formData,
        data_atualizacao: new Date().toISOString(),
      }

      if (produto?.id) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('produtos')
          .update(dataToSubmit as ProdutoUpdate)
          .eq('id', produto.id)

        if (error) throw error
      } else {
        // Adicionar novo produto
        const { error } = await supabase
          .from('produtos')
          .insert([{
            ...dataToSubmit,
            data_criacao: new Date().toISOString(),
          } as ProdutoInsert])

        if (error) throw error
      }

      router.push('/produtos')
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      // Adicione uma notificação de erro para o usuário aqui
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Produto</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="categoria_id">Categoria</Label>
        <Select
          value={formData.categoria_id?.toString() || ''}
          onValueChange={handleCategoriaChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id.toString()}>
                {categoria.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="subcategoria_id">Subcategoria</Label>
        <Select
          value={formData.subcategoria_id?.toString() || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoria_id: Number(value) }))}
          disabled={!formData.categoria_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {subcategorias.map((subcategoria) => (
              <SelectItem key={subcategoria.id} value={subcategoria.id.toString()}>
                {subcategoria.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="preco">Preço</Label>
        <Input
          id="preco"
          name="preco"
          type="number"
          step="0.01"
          value={formData.preco?.toString() || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="estoque">Estoque</Label>
        <Input
          id="estoque"
          name="estoque"
          type="number"
          value={formData.estoque?.toString() || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          value={formData.descricao || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="fornecedor_id">ID do Fornecedor</Label>
        <Input
          id="fornecedor_id"
          name="fornecedor_id"
          type="number"
          value={formData.fornecedor_id?.toString() || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="imagem">URL da Imagem</Label>
        <Input
          id="imagem"
          name="imagem"
          value={formData.imagem || ''}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">
        {produto ? 'Atualizar Produto' : 'Adicionar Produto'}
      </Button>
    </form>
  )
}

