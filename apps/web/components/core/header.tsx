"use client"

import React from 'react'
import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import { Separator } from '@workspace/ui/components/separator'
import { Button } from '@workspace/ui/components/button'
import { IconPlus, IconBell, IconSearch } from '@tabler/icons-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb'
import { PrimaryButton } from '@workspace/ui/components/primary-button'
import ThemeToggle from './theme-toggle'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'

export const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
      <div className="flex items-center gap-2 flex-1">
        {/* Left Side */}
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/theme1">TaxFlow Pro</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold'>Dashboard</h2>
          <p className='text-sm text-muted-foreground'>Overview</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput placeholder="Search Clients, Documents, etc." />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>

        </InputGroup>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <IconBell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <PrimaryButton>
          <IconPlus />
          New Client
        </PrimaryButton>
        <ThemeToggle />
      </div>
    </header>
  )
}
