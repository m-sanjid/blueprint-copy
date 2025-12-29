"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

export interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  badge?: React.ReactNode
}

interface SidebarNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()

  const isItemActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(url)
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <AnimatePresence>
          {items.map((item) => {
            const isActive = isItemActive(item.url)

            return (
              <SidebarMenuItem key={item.title} className="relative ">
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-sidebar-accent rounded-md z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className="relative z-10"
                >
                  <Link href={item.url}>
                    <span className="text-muted-foreground">{item.icon}</span>
                    <span className={cn(isActive ? "font-medium" : "")}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="ml-auto">{item.badge}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </AnimatePresence>
      </SidebarMenu>
    </SidebarGroup>
  )
}
