"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { LogOut, Settings, User } from "lucide-react"
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
  const { state, isMobile } = useSidebar()
  const user = data.user
  if (!user) return null

  const isCollapsed = state === "collapsed" && !isMobile

  const percent = Math.min(
    100,
    Math.round((user.pdfsUsed / user.pdfsTotal) * 100)
  )

  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // Collapsed view - just avatar with tooltip
  if (isCollapsed) {
    return (
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="rounded-lg text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.plan}</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    )
  }

  // Expanded view - full user nav always visible
  return (
    <SidebarFooter className="p-2">
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl bg-neutral-50 dark:bg-neutral-50/5 backdrop-blur-xl p-2 space-y-2">
          {/* User */}
          <div className="bg-white dark:bg-neutral-950 rounded-lg">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className="h-9 w-9 rounded-xl">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="rounded-xl text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.plan}</p>
              </div>
            </div>

            {/* Usage */}
            <div className="px-2">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {user.pdfsUsed}/{user.pdfsTotal} PDFs used
              </p>
            </div>
          </div>

          <Separator />

          {/* Primary actions */}
          <NavItem href="/account" icon={User}>
            Account
          </NavItem>

          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>

          <Separator />

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
        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
