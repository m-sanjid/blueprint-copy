"use client"

import React, { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { SidebarTrigger, useSidebar } from '@workspace/ui/components/sidebar'
import { PrimaryButton } from '@workspace/ui/components/primary-button'
import { IconBell, IconPlus, IconSearch } from '@tabler/icons-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import ThemeToggle from '@/components/core/theme-toggle'
import { Container } from '@/components/core/container'
import { AddClientDialog, type ClientFormData } from '@/components/dialogs'
import { toast } from 'sonner'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  /** Custom primary action. If not provided, defaults to "New Client" button */
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  /** Callback when a new client is added via the default "New Client" button */
  onClientAdded?: (data: ClientFormData) => void
  className?: string
}

// API stub for creating client from header
async function createClientFromHeader(data: ClientFormData): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/clients', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Creating client from header:', data)
  return { success: true }
}

export function PageHeader({
  title,
  subtitle,
  showSearch = true,
  searchPlaceholder = "Search clients, documents...",
  onSearch,
  primaryAction,
  onClientAdded,
  className
}: PageHeaderProps) {
  const { open } = useSidebar()
  const [addClientOpen, setAddClientOpen] = useState(false)

  const handleAddClient = async (data: ClientFormData) => {
    try {
      const result = await createClientFromHeader(data)
      if (result.success) {
        toast.success('Client created successfully!', {
          description: `${data.name} has been added as a ${data.entityType}.`
        })
        onClientAdded?.(data)
      }
    } catch (error) {
      toast.error('Failed to create client')
      console.error(error)
    }
  }

  return (
    <>
      {/* Only render AddClientDialog when using default action */}
      {!primaryAction && (
        <AddClientDialog
          open={addClientOpen}
          onOpenChange={setAddClientOpen}
          onSubmit={handleAddClient}
        />
      )}

      <div className='border-b sticky top-0 z-10 bg-background'>
        <Container className={cn("flex items-center justify-between py-4", className)}>
          {!open && <SidebarTrigger className='absolute left-2' />}
          <div className="space-y-1.5 ml-2">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
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
            {primaryAction ? (
              <PrimaryButton onClick={primaryAction.onClick}>
                {primaryAction.icon || <IconPlus className="h-4 w-4 mr-2" />}
                {primaryAction.label}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => setAddClientOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                New Client
              </PrimaryButton>
            )}
            <ThemeToggle />
          </div>
        </Container>
      </div>
    </>
  )
}
