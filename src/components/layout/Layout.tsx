import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { ExperienceBar } from '@/experience/ExperienceBar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--warm-white, #FEFCFA)' }}
    >
      <Navbar />
      <ExperienceBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
