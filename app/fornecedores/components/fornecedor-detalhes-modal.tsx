'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

interface Fornecedor {
  id: number
  nome: string
  contato: string
  email: string
  telefone: string
  endereco: string
  data_criacao: string
  data_atualizacao: string
}

interface FornecedorDetalhesModalProps {
  fornecedorId: number | null
  isOpen: boolean
  onClose: () => void
}

export function FornecedorDetalhesModal({ fornecedorId, isOpen, onClose }: FornecedorDetalhesModalProps) {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)

  useEffect(() => {
    if (fornecedorId) {
      fetchFornecedorDetalhes(fornecedorId)
    }
  }, [fornecedorId])

  async function fetchFornecedorDetalhes(id: number) {
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setFornecedor(data as Fornecedor)
      } else {
        console.error('Fornecedor não encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do fornecedor:', error)
    }
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null }) => (
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span>{value ?? 'N/A'}</span>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes do Fornecedor</DialogTitle>
        </DialogHeader>
        {fornecedor ? (
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{fornecedor.nome}</h2>
                  <Badge variant="outline">ID: {fornecedor.id}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
                <div className="space-y-2">
                  <DetailItem icon={User} label="Contato" value={fornecedor.contato} />
                  <DetailItem icon={Mail} label="E-mail" value={fornecedor.email} />
                  <DetailItem icon={Phone} label="Telefone" value={fornecedor.telefone} />
                  <DetailItem icon={MapPin} label="Endereço" value={fornecedor.endereco} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
                <div className="space-y-2">
                  <DetailItem icon={Calendar} label="Data de Criação" value={fornecedor.data_criacao ? new Date(fornecedor.data_criacao).toLocaleString() : null} />
                  <DetailItem icon={Calendar} label="Última Atualização" value={fornecedor.data_atualizacao ? new Date(fornecedor.data_atualizacao).toLocaleString() : null} />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>Carregando detalhes do fornecedor...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

