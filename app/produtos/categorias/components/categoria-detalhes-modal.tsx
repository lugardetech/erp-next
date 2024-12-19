'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tag, Calendar, FileText, Package } from 'lucide-react'
import { Categoria } from '@/types/database.types'

interface CategoriaDetalhesModalProps {
  categoriaId: number | null
  isOpen: boolean
  onClose: () => void
}

export function CategoriaDetalhesModal({ categoriaId, isOpen, onClose }: CategoriaDetalhesModalProps) {
  const [categoria, setCategoria] = useState<Categoria | null>(null)

  useEffect(() => {
    if (categoriaId) {
      fetchCategoriaDetalhes(categoriaId)
    }
  }, [categoriaId])

  async function fetchCategoriaDetalhes(id: number) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setCategoria(data as Categoria)
      } else {
        console.error('Categoria não encontrada')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da categoria:', error)
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes da Categoria</DialogTitle>
        </DialogHeader>
        {categoria ? (
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{categoria.nome}</h2>
                  <Badge variant="outline">ID: {categoria.id}</Badge>
                </div>
                <p className="text-muted-foreground mt-2">{categoria.descricao || 'Sem descrição'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
                <div className="space-y-2">
                  <DetailItem icon={Tag} label="Nome" value={categoria.nome} />
                  <DetailItem icon={FileText} label="Descrição" value={categoria.descricao} />
                  <DetailItem icon={Calendar} label="Data de Criação" value={categoria.data_criacao ? new Date(categoria.data_criacao).toLocaleString() : null} />
                  <DetailItem icon={Calendar} label="Última Atualização" value={categoria.data_atualizacao ? new Date(categoria.data_atualizacao).toLocaleString() : null} />
                </div>
              </CardContent>
            </Card>

            {/* Aqui você pode adicionar mais cards com informações relacionadas, como produtos nesta categoria */}
          </div>
        ) : (
          <p>Carregando detalhes da categoria...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

