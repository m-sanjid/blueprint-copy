"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { SidebarTrigger, useSidebar } from '@workspace/ui/components/sidebar'
import { PrimaryButton } from '@workspace/ui/components/primary-button'
import { IconBell, IconPlus, IconSearch } from '@tabler/icons-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import ThemeToggle from '@/components/core/theme-toggle'
import { Container } from '@/components/core/container'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  showSearch = true,
  searchPlaceholder = "Search clients, documents...",
  onSearch,
  primaryAction,
  className
}: PageHeaderProps) {

  const { open } = useSidebar()

  return (
    <div className='border-b sticky top-0 z-10 bg-background'>
      <Container className={cn("flex items-center justify-between py-4", className)}>
        {/* <div className="flex items-center gap-1"> */}
        {!open && <SidebarTrigger className='absolute left-2' />}
        <div className="space-y-1.5 ml-2">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {/* </div> */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <InputGroup>
              <InputGroupInput
                placeholder={searchPlaceholder}
                className="pl-9 w-64"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>

            </InputGroup>
          )}
          <Button variant="ghost" size="icon" className="relative">
            <IconBell className="size-6" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          {primaryAction && (
            <PrimaryButton onClick={primaryAction.onClick}>
              {primaryAction.icon || <IconPlus className="h-4 w-4 mr-2" />}
              {primaryAction.label}
            </PrimaryButton>
          )}
          <ThemeToggle />
        </div>
      </Container>
    </div>
  )
}
