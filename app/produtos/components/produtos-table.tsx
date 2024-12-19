'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { MoreHorizontal, ArrowUpDown, Trash2, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { ProdutoDetalhesModal } from './produto-detalhes-modal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Produto } from '@/types/database.types'

interface ProdutoWithRelations extends Produto {
  categorias: { nome: string } | null
  subcategorias: { nome: string } | null
}

export function ProdutosTable() {
  const [produtos, setProdutos] = useState<ProdutoWithRelations[]>([])
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof Produto>('nome')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchProdutos()
  }, [currentPage, searchTerm, sortColumn, sortOrder, itemsPerPage])

  async function fetchProdutos() {
    try {
      let query = supabase
        .from('produtos')
        .select(`
          *,
          categorias(nome),
          subcategorias(nome)
        `, { count: 'exact' })
        .order(sortColumn, { ascending: sortOrder === 'asc' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,categorias.nome.ilike.%${searchTerm}%,subcategorias.nome.ilike.%${searchTerm}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setProdutos(data as ProdutoWithRelations[] || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  const handleSort = (column: keyof Produto) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('produtos')
          .delete()
          .eq('id', id)

        if (error) throw error

        fetchProdutos()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
      }
    }
  }

  const handleViewDetails = (produtoId: number) => {
    setSelectedProdutoId(produtoId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProdutoId(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => handleSort('nome')}>
                Nome
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('sku')}>
                SKU
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('categoria_id')}>
                Categoria
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('subcategoria_id')}>
                Subcategoria
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('preco')}>
                Preço
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('estoque')}>
                Estoque
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('data_atualizacao')}>
                Última Atualização
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow 
              key={produto.id} 
              onClick={() => handleViewDetails(produto.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">{produto.nome}</TableCell>
              <TableCell>{produto.sku}</TableCell>
              <TableCell>{produto.categorias?.nome || 'N/A'}</TableCell>
              <TableCell>{produto.subcategorias?.nome || 'N/A'}</TableCell>
              <TableCell>{produto.preco ? `R$ ${produto.preco.toFixed(2)}` : 'N/A'}</TableCell>
              <TableCell>{produto.estoque || 'N/A'}</TableCell>
              <TableCell>{produto.data_atualizacao ? new Date(produto.data_atualizacao).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(produto.id);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Ver detalhes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/produtos/${produto.id}`} onClick={(e) => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(produto.id);
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <ProdutoDetalhesModal 
        produtoId={selectedProdutoId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

