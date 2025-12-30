"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
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

// ============================================================================
// Types
// ============================================================================
export type UserNavState = 'loading' | 'data' | 'empty'

export interface UserData {
  name: string
  avatar: string
  plan: string
  pdfsUsed: number
  pdfsTotal: number
}

export interface SidebarUserNavProps {
  data?: {
    user: UserData
  }
  state?: UserNavState
}

// ============================================================================
// Skeleton State
// ============================================================================
function SidebarUserNavSkeleton() {
  return (
    <SidebarFooter className="p-2">
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl bg-neutral-50 dark:bg-neutral-50/5 backdrop-blur-xl p-2 space-y-2">
          <div className="bg-white dark:bg-neutral-950 rounded-lg py-2 border">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="px-2">
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
          </div>
          <Separator />
          <div className="flex gap-2 items-center justify-end">
            <NavItem href="/account" icon={User} tooltip="Account" />
            <NavItem href="/settings" icon={Settings} tooltip="Settings" />
            <NavItem
              href="/logout"
              icon={LogOut}
              className="text-destructive hover:bg-destructive/10"
              tooltip="Log out"
            />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

// ============================================================================
// Empty State
// ============================================================================
function SidebarUserNavEmpty() {
  return (
    <SidebarFooter className="p-2">
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl bg-neutral-50 dark:bg-neutral-50/5 backdrop-blur-xl p-2">
          <div className="bg-white dark:bg-neutral-950 rounded-lg py-3 border text-center">
            <User className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Not signed in</p>
            <Link
              href="/login"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Sign in
            </Link>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

// ============================================================================
// Collapsed Skeleton
// ============================================================================
function CollapsedSkeleton() {
  return (
    <SidebarFooter className="p-2">
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col items-center gap-1">
          <div className="p-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export const SidebarUserNav = ({ data, state = 'data' }: SidebarUserNavProps) => {
  const { state: sidebarState, isMobile } = useSidebar()
  const isCollapsed = sidebarState === "collapsed" && !isMobile

  // Loading State
  if (state === 'loading') {
    return isCollapsed ? <CollapsedSkeleton /> : <SidebarUserNavSkeleton />
  }

  // Empty State or no user
  if (state === 'empty' || !data?.user) {
    if (isCollapsed) {
      return (
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-col items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/login" className="p-1">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  <p className="font-medium">Sign in</p>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )
    }
    return <SidebarUserNavEmpty />
  }

  const user = data.user
  const percent = Math.min(100, Math.round((user.pdfsUsed / user.pdfsTotal) * 100))
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

  // Expanded view - full user nav
  return (
    <SidebarFooter className="p-2">
      <SidebarMenu>
        <SidebarMenuItem className="rounded-xl bg-neutral-50 dark:bg-neutral-50/5 backdrop-blur-xl p-2 space-y-2">
          {/* User */}
          <div className="bg-white dark:bg-neutral-950 rounded-lg py-2 border">
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
          <div className="flex gap-2 items-center justify-end">
            <NavItem href="/account" icon={User} tooltip="Account" />
            <NavItem href="/settings" icon={Settings} tooltip="Settings" />
            <NavItem
              href="/logout"
              icon={LogOut}
              className="text-destructive hover:bg-destructive/10"
              tooltip="Log out"
            />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

// ============================================================================
// NavItem Helper
// ============================================================================
function NavItem({
  href,
  icon: Icon,
  tooltip,
  className,
}: {
  href: string
  icon: React.ElementType
  tooltip: string
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center justify-center border p-1 rounded-md w-fit",
            className
          )}
        >
          <Icon className="h-4 w-4" />
        </Link>
      </TooltipTrigger>
      <TooltipContent className="border">
        <p className="font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
