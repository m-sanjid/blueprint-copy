import AppSidebar from '@/components/core/app-sidebar'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className='h-screen overflow-y-auto relative'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout