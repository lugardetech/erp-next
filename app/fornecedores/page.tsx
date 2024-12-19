'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FornecedoresTable } from './components/fornecedores-table'
import { FornecedorForm } from './components/fornecedor-form'
import { FornecedorDetalhesModal } from './components/fornecedor-detalhes-modal'

export default function FornecedoresPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingFornecedorId, setEditingFornecedorId] = useState<number | undefined>(undefined)
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<number | null>(null)

  const handleAddNew = () => {
    setEditingFornecedorId(undefined)
    setIsFormModalOpen(true)
  }

  const handleEdit = (id: number) => {
    setEditingFornecedorId(id)
    setIsFormModalOpen(true)
  }

  const handleViewDetails = (id: number) => {
    setSelectedFornecedorId(id)
    setIsDetailsModalOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormModalOpen(false)
    // Você pode adicionar aqui uma lógica para atualizar a tabela, se necessário
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Gerenciamento de Fornecedores</h1>
      <div className="mb-4">
        <Button onClick={handleAddNew}>Adicionar Novo Fornecedor</Button>
      </div>
      <FornecedoresTable onEdit={handleEdit} onViewDetails={handleViewDetails} />
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFornecedorId ? 'Editar' : 'Adicionar'} Fornecedor</DialogTitle>
          </DialogHeader>
          <FornecedorForm
            fornecedorId={editingFornecedorId}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <FornecedorDetalhesModal
        fornecedorId={selectedFornecedorId}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}

