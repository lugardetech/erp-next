'use client'

import { useState } from 'react'
import { CategoriasTable } from './components/categorias-table'
import { CategoriaForm } from './components/categoria-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CategoriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    setIsModalOpen(false)
    // Adicione aqui a lógica para atualizar a lista de categorias
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Categorias</h1>
      <div className="mb-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Nova Categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            </DialogHeader>
            <CategoriaForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <CategoriasTable />
    </div>
  )
}

