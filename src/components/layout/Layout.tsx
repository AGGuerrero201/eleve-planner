import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { ExperienceBar } from '@/experience/ExperienceBar'
import { MobileTabBar } from '@/components/mobile/MobileTabBar'

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
      <main className="flex-1 pb-20 sm:pb-0">
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}
