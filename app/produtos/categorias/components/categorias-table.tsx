'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { MoreHorizontal, ArrowUpDown, Trash2, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Categoria } from '@/types/database.types'
import { CategoriaDetalhesModal } from './categoria-detalhes-modal'

export function CategoriasTable() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof Categoria>('nome')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCategorias = useCallback(async () => {
    try {
      let query = supabase
        .from('categorias')
        .select('*', { count: 'exact' })
        .order(sortColumn, { ascending: sortOrder === 'asc' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

      if (searchTerm) {
        query = query.ilike('nome', `%${searchTerm}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setCategorias(data || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }, [currentPage, searchTerm, sortColumn, sortOrder, itemsPerPage])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const handleSort = (column: keyof Categoria) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        const { error } = await supabase
          .from('categorias')
          .delete()
          .eq('id', id)

        if (error) throw error

        fetchCategorias()
      } catch (error) {
        console.error('Erro ao excluir categoria:', error)
      }
    }
  }

  const handleViewDetails = (categoriaId: number) => {
    setSelectedCategoriaId(categoriaId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategoriaId(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
              <Button variant="ghost" onClick={() => handleSort('descricao')}>
                Descrição
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('data_criacao')}>
                Data de Criação
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <TableRow 
              key={categoria.id}
              className="cursor-pointer"
              onClick={() => handleViewDetails(categoria.id)}
            >
              <TableCell className="font-medium">{categoria.nome}</TableCell>
              <TableCell>{categoria.descricao || 'N/A'}</TableCell>
              <TableCell>{categoria.data_criacao ? new Date(categoria.data_criacao).toLocaleDateString() : 'N/A'}</TableCell>
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
                      handleViewDetails(categoria.id);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Ver detalhes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/produtos/categorias/${categoria.id}`} onClick={(e) => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(categoria.id);
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
      <CategoriaDetalhesModal 
        categoriaId={selectedCategoriaId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

