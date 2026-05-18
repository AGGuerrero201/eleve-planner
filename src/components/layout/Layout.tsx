import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { SupabaseStatus } from '@/components/ui/SupabaseStatus'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      <SupabaseStatus />
      <main className="flex-1">{children}</main>
    </div>
  )
}
