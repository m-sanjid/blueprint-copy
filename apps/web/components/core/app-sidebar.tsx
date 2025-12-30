"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar"

import {
  SidebarHeader,
  SidebarNav,
  type NavItem,
  SidebarUserNav,
} from "./sidebar"
import { IconBrain, IconCalculator, IconFileText, IconHeartRateMonitor, IconLayoutDashboard, IconLock, IconMap, IconSettings, IconUsers } from "@tabler/icons-react"
import { CompanyLogo } from "./logo"

// Main navigation items matching the reference design
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <IconLayoutDashboard className="size-4" />,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: <IconFileText className="size-4" />,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: <IconUsers className="size-4" />,
  },
  {
    title: "Strategy Engine",
    url: "/strategy-engine",
    icon: <IconBrain className="size-4" />,
  },
  {
    title: "Quant Engine",
    url: "/quant-engine",
    icon: <IconCalculator className="size-4" />,
  },
  {
    title: "Roadmaps",
    url: "/roadmaps",
    icon: <IconMap className="size-4" />,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: <IconFileText className="size-4" />,
  }, {
    title: "Monitoring",
    url: "/monitoring",
    icon: <IconHeartRateMonitor className="size-4" />,
  },
  {
    title: "Security",
    url: "/security",
    icon: <IconLock className="size-4" />,
  }, {
    title: "Settings",
    url: "/settings",
    icon: <IconSettings className="size-4" />,
  },
]



const AppSidebar = () => {
  const { open } = useSidebar()
  const [userState, setUserState] = React.useState<'loading' | 'data'>('loading')

  // Simulate loading on mount (replace with actual API call)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setUserState('data')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarHeader
        company={{
          name: "Blueprint",
          logo: <CompanyLogo />,
        }}
      />
      <SidebarContent>
        <SidebarNav items={navItems} />
      </SidebarContent>
      <SidebarRail />
      <SidebarUserNav
        state={userState}
        data={{ user: { name: "John Doe", avatar: "https://via.placeholder.com/150", plan: "Bronze", pdfsUsed: 62, pdfsTotal: 100 } }}
      />
    </Sidebar>
  )
}

export default AppSidebar