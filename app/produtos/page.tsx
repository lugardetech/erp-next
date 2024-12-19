import { ProdutosTable } from './components/produtos-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProdutosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>
      <div className="mb-4">
        <Button asChild>
          <Link href="/produtos/novo">Adicionar Novo Produto</Link>
        </Button>
      </div>
      <ProdutosTable />
    </div>
  )
}

