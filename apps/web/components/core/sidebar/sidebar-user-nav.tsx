"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { CreditCard, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export interface SidebarUserNavProps {
  data: {
    user: {
      name: string
      avatar: string
      plan: string
      pdfsUsed: number
      pdfsTotal: number
    }
  }
}

export const SidebarUserNav = ({ data }: SidebarUserNavProps) => {
  const { isMobile } = useSidebar()
  const user = data.user
  if (!user) return null

  const pdfsLeft = user.pdfsTotal - user.pdfsUsed
  const usagePercent = Math.min(
    100,
    Math.round((user.pdfsUsed / user.pdfsTotal) * 100)
  )

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }

  return (
    <SidebarFooter className="p-2">
      <SidebarMenu className="space-y-2">
        <SidebarMenuItem className="rounded-xl bg-muted/40 p-2">
          {/* User Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9 rounded-xl">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-xl text-xs font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.plan}
              </p>
            </div>
          </div>

          {/* Usage */}
          <div className="mt-2 rounded-lg bg-background p-2">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>PDF usage</span>
              <span>
                {user.pdfsUsed}/{user.pdfsTotal}
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {pdfsLeft} PDFs remaining this month
            </p>
          </div>

          <Separator className="my-2" />

          {/* Navigation */}
          <SidebarGroup className="space-y-1">
            <NavItem href="/account" icon={User}>
              Account
            </NavItem>
            <NavItem href="/billing" icon={CreditCard}>
              Billing
            </NavItem>
            <NavItem href="/settings" icon={Settings}>
              Settings
            </NavItem>
          </SidebarGroup>

          <Separator className="my-2" />

          {/* Logout */}
          <NavItem
            href="/logout"
            icon={LogOut}
            className="text-destructive hover:bg-destructive/10"
          >
            Log out
          </NavItem>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

function NavItem({
  href,
  icon: Icon,
  children,
  className,
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </Link>
  )
}
