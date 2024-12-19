import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MenuLateral } from '@/components/menu-lateral'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lugar de Tech ERP',
  description: 'Sistema de gerenciamento para Lugar de Tech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex h-screen">
            <MenuLateral />
            <SidebarInset className="flex-grow">
              <main className="p-4">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

