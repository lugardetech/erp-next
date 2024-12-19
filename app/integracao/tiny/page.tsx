'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Settings, AlertCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TinyConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  vercelUrl: string
}

export default function TinyIntegracaoPage() {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [config, setConfig] = useState<TinyConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    vercelUrl: ''
  })
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/tiny-config')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.error) {
        setError(data.error)
      } else {
        setConfig(data)
        setError(null)
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações')
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível carregar as configurações.",
        variant: "destructive",
      })
    }
  }

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  const handleConfigSave = async () => {
    try {
      const response = await fetch('/api/tiny-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso.",
      })
      setIsConfigOpen(false)
      fetchConfig() // Atualiza as configurações após salvar
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Integração com Tiny</h1>
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações da Integração</DialogTitle>
              <DialogDescription>Configure as credenciais para a integração com o Tiny.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientId" className="text-right">
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  name="clientId"
                  value={config.clientId}
                  onChange={handleConfigChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientSecret" className="text-right">
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  name="clientSecret"
                  type="password"
                  value={config.clientSecret}
                  onChange={handleConfigChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="redirectUri" className="text-right">
                  Redirect URI
                </Label>
                <Input
                  id="redirectUri"
                  name="redirectUri"
                  value={config.redirectUri}
                  onChange={handleConfigChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vercelUrl" className="text-right">
                  URL da Vercel
                </Label>
                <Input
                  id="vercelUrl"
                  name="vercelUrl"
                  value={config.vercelUrl}
                  onChange={handleConfigChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleConfigSave}>Salvar Configurações</Button>
          </DialogContent>
        </Dialog>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Redirect URI</TableHead>
                <TableHead>URL da Vercel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.clientId ? (
                <TableRow>
                  <TableCell>{config.clientId}</TableCell>
                  <TableCell>{config.redirectUri}</TableCell>
                  <TableCell>{config.vercelUrl}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    {error ? 'Erro ao carregar dados' : 'Nenhum dado disponível'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

