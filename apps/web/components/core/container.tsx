import { cn } from '@workspace/ui/lib/utils'
import React from 'react'

export const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("w-full mx-auto px-4 md:px-6 lg:px-8 2xl:px-12", className)}>{children}</div>
  )
}
