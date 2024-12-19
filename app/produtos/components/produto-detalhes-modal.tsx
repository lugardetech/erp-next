'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Barcode, Tag, Layers, DollarSign, ShoppingCart, FileText, Truck, Image, Calendar } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  preco: number | null
  estoque: number | null
  sku: string
  categoria_id: number | null
  subcategoria_id: number | null
  descricao: string | null
  fornecedor_id: number | null
  imagem: string | null
  data_criacao: string | null
  data_atualizacao: string | null
  categorias: { nome: string } | null
  subcategorias: { nome: string } | null
}

interface ProdutoDetalhesModalProps {
  produtoId: number | null
  isOpen: boolean
  onClose: () => void
}

export function ProdutoDetalhesModal({ produtoId, isOpen, onClose }: ProdutoDetalhesModalProps) {
  const [produto, setProduto] = useState<Produto | null>(null)

  useEffect(() => {
    if (produtoId) {
      fetchProdutoDetalhes(produtoId)
    }
  }, [produtoId])

  async function fetchProdutoDetalhes(id: number) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias(nome),
          subcategorias(nome)
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProduto(data as Produto)
      } else {
        console.error('Produto não encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error)
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
          <DialogTitle className="text-2xl font-bold">Detalhes do Produto</DialogTitle>
        </DialogHeader>
        {produto ? (
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{produto.nome}</h2>
                  <Badge variant={produto.estoque && produto.estoque > 0 ? "success" : "destructive"}>
                    {produto.estoque && produto.estoque > 0 ? "Em estoque" : "Sem estoque"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2">{produto.descricao || 'Sem descrição'}</p>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                  <div className="space-y-2">
                    <DetailItem icon={Barcode} label="SKU" value={produto.sku} />
                    <DetailItem icon={Tag} label="Categoria" value={produto.categorias?.nome} />
                    <DetailItem icon={Layers} label="Subcategoria" value={produto.subcategorias?.nome} />
                    <DetailItem icon={DollarSign} label="Preço" value={produto.preco ? `R$ ${produto.preco.toFixed(2)}` : null} />
                    <DetailItem icon={ShoppingCart} label="Estoque" value={produto.estoque} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Detalhes Adicionais</h3>
                  <div className="space-y-2">
                    <DetailItem icon={Truck} label="Fornecedor ID" value={produto.fornecedor_id} />
                    <DetailItem icon={Image} label="Imagem" value={produto.imagem ? 'Disponível' : 'Não disponível'} />
                    <DetailItem icon={Calendar} label="Data de Criação" value={produto.data_criacao ? new Date(produto.data_criacao).toLocaleDateString() : null} />
                    <DetailItem icon={Calendar} label="Última Atualização" value={produto.data_atualizacao ? new Date(produto.data_atualizacao).toLocaleDateString() : null} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {produto.imagem && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Imagem do Produto</h3>
                  <img src={produto.imagem} alt={produto.nome} className="w-full h-auto rounded-lg" />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <p>Carregando detalhes do produto...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

