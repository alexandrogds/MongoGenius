'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DatabaseZap, Lightbulb, ListTree } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';

const menuItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Schema Generator', icon: DatabaseZap },
  { href: '/query-optimizer', label: 'Query Optimizer', icon: Lightbulb },
  { href: '/index-suggester', label: 'Index Suggester', icon: ListTree },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPage = menuItems.find(item => item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">
            {currentPage?.label || "MongoGenius"}
          </h1>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
