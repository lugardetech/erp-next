import { FornecedorForm } from '../components/fornecedor-form'

export default function NovoFornecedorPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Adicionar Novo Fornecedor</h1>
      <FornecedorForm />
    </div>
  )
}

