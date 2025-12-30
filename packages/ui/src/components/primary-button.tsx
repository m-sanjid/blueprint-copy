import { Button } from '@workspace/ui/components/button'
import React from 'react'
import { cn } from '@workspace/ui/lib/utils'

export const PrimaryButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button {...props} className={cn('bg-linear-to-b shadow-primary/24 shadow-xs from-blue-500 to-blue-600 text-shadow-2xs active:scale-[98%] hover:scale-[102%] hover:shadow-md transition-all duration-200 ease-in-out hover:bg-blue-600 ',
      '[:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)]',
      className)}>
      {children}
    </Button>
  )
}
