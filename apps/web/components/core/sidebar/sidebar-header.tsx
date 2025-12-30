"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader as SidebarHeaderBase,
  useSidebar,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface Company {
  name: string
  logo: React.ReactNode
}

interface SidebarHeaderProps {
  company: Company
  companies?: Company[]
  onCompanyChange?: (company: Company) => void
}

export function SidebarHeader({ company, companies = [], onCompanyChange }: SidebarHeaderProps) {
  const { open } = useSidebar()

  return (
    <SidebarHeaderBase className="relative">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between"
          >
            <div className="flex items-center gap-2">
              <Button size="icon-sm" asChild className="size-8">
                <span>{company.logo}</span>
              </Button>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{company.name}</span>
              </div>
            </div>
            <SidebarTrigger className={cn("", !open && "hidden")} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeaderBase>
  )
}
