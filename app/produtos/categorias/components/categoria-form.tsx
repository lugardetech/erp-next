'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabaseClient'
import { CategoriaInsert } from '@/types/database.types'

interface CategoriaFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CategoriaForm({ onSuccess, onCancel }: CategoriaFormProps) {
  const [formData, setFormData] = useState<CategoriaInsert>({
    nome: '',
    descricao: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('categorias')
        .insert([{
          ...formData,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
        }])

      if (error) throw error

      onSuccess()
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error)
      // Adicione uma notificação de erro para o usuário aqui
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Categoria</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
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
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Adicionar Categoria</Button>
      </div>
    </form>
  )
}

