import { ProdutoForm } from '../components/produto-form'

export default function NovoProdutoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Adicionar Novo Produto</h1>
      <ProdutoForm />
    </div>
  )
}

