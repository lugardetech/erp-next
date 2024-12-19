'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tags, Truck, LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export function MenuLateral() {
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    {
      icon: Package,
      label: 'Produtos',
      href: '/produtos',
      subItems: [
        { label: 'Lista de Produtos', href: '/produtos' },
        { label: 'Categorias', href: '/produtos/categorias' },
      ],
    },
    { icon: Truck, label: 'Fornecedores', href: '/fornecedores' },
    {
      icon: LinkIcon,
      label: 'Integração',
      href: '/integracao',
      subItems: [
        { label: 'Tiny', href: '/integracao/tiny' },
      ],
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Lugar de Tech ERP</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              {item.subItems ? (
                <>
                  <SidebarMenuButton>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.href}
                        >
                          <Link href={subItem.href}>{subItem.label}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="absolute bottom-4 left-4">
        <SidebarTrigger />
      </div>
    </Sidebar>
  )
}

