import AppSidebar from '@/components/core/app-sidebar'
import { Container } from '@/components/core/container'
import { Header } from '@/components/core/header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Container className='py-8'>
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout