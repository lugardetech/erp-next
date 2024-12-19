import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const { clientId, clientSecret, redirectUri, vercelUrl } = await request.json()

    const { data, error } = await supabase
      .from('credenciais_aplicacoes')
      .upsert({
        nome_aplicacao: 'Tiny',
        client_id: clientId,
        client_secret: clientSecret,
        dados_adicionais: { redirectUri, vercelUrl },
        atualizado_em: new Date().toISOString()
      }, {
        onConflict: 'nome_aplicacao'
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar configurações' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('credenciais_aplicacoes')
      .select('*')
      .eq('nome_aplicacao', 'Tiny')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return NextResponse.json({ error: 'Configurações não encontradas' }, { status: 404 })
      }
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: 'Configurações não encontradas' }, { status: 404 })
    }

    const { client_id, client_secret, dados_adicionais } = data
    const { redirectUri, vercelUrl } = dados_adicionais || {}

    return NextResponse.json({ clientId: client_id, clientSecret: client_secret, redirectUri, vercelUrl })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações' }, { status: 500 })
  }
}

