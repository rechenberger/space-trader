'use client'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

export const SubmitButton = ({
  children,
  disabled,
  ...props
}: { children: ReactNode } & ButtonProps) => {
  const { pending } = useFormStatus()
  const Icon = pending ? Loader2 : ArrowRight
  return (
    <>
      <Button type="submit" disabled={pending || disabled} {...props}>
        {children}
        <Icon className={cn('w-4 h-4 ml-2', pending && 'animate-spin')} />
      </Button>
    </>
  )
}
