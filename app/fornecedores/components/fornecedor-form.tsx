'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabaseClient'

interface FornecedorFormData {
  id?: number
  nome: string
  contato: string
  email: string
  telefone: string
  endereco: string
}

interface FornecedorFormProps {
  fornecedorId?: number
  onSuccess: () => void
  onCancel: () => void
}

export function FornecedorForm({ fornecedorId, onSuccess, onCancel }: FornecedorFormProps) {
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome: '',
    contato: '',
    email: '',
    telefone: '',
    endereco: '',
  })

  useEffect(() => {
    if (fornecedorId) {
      fetchFornecedor(fornecedorId)
    }
  }, [fornecedorId])

  async function fetchFornecedor(id: number) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar fornecedor:', error)
    } else if (data) {
      setFormData(data)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (fornecedorId) {
        const { error } = await supabase
          .from('fornecedores')
          .update(formData)
          .eq('id', fornecedorId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('fornecedores')
          .insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Fornecedor</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="contato">Nome do Contato</Label>
        <Input
          id="contato"
          name="contato"
          value={formData.contato}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Textarea
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {fornecedorId ? 'Atualizar' : 'Adicionar'} Fornecedor
        </Button>
      </div>
    </form>
  )
}

