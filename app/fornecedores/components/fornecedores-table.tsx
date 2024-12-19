'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabaseClient'

interface Fornecedor {
  id: number
  nome: string
  contato: string
  email: string
  telefone: string
}

interface FornecedoresTableProps {
  onEdit: (id: number) => void
  onViewDetails: (id: number) => void
}

export function FornecedoresTable({ onEdit, onViewDetails }: FornecedoresTableProps) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  useEffect(() => {
    fetchFornecedores()
  }, [])

  async function fetchFornecedores() {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar fornecedores:', error)
    } else {
      setFornecedores(data)
    }
  }

  async function handleDelete(id: number) {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir fornecedor:', error)
      } else {
        fetchFornecedores()
      }
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fornecedores.map((fornecedor) => (
          <TableRow 
            key={fornecedor.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onViewDetails(fornecedor.id)}
          >
            <TableCell className="font-medium">{fornecedor.nome}</TableCell>
            <TableCell>{fornecedor.contato}</TableCell>
            <TableCell>{fornecedor.email}</TableCell>
            <TableCell>{fornecedor.telefone}</TableCell>
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
                    onEdit(fornecedor.id);
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(fornecedor.id);
                  }}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

