'use client'

import { Button } from '@/components/ui/button'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import React from 'react'

const SecretInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [hidden, setHidden] = React.useState(true)
    const [copied, setCopied] = React.useState(false)
    return (
      <div className="inline-flex flex-row">
        <Input
          ref={ref}
          {...props}
          type={hidden ? 'password' : 'text'}
          autoComplete="new-password"
          className={cn(
            'rounded-l-md border rounded-r-none border-r-0 focus:ring-offset-0 z-0 focus:z-10',
            className,
          )}
        />
        <Button
          size="icon"
          className="rounded-none border-neutral-300 border border-l-none dark:border-neutral-700 h-10 aspect-square z-0 focus:z-10"
          variant="ghost"
          type="button"
          onClick={() => setHidden((e) => !e)}
        >
          {hidden ? <Eye strokeWidth={1} /> : <EyeOff strokeWidth={1} />}
        </Button>
        <Button
          size="icon"
          className={cn(
            'rounded-l-none border-neutral-300 border border-l-none dark:border-neutral-700 h-10 aspect-square z-0 focus:z-10',
            copied && 'text-green-500 hover:text-green-500',
          )}
          variant="ghost"
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(props.value?.toString() || '')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          {copied ? <Check strokeWidth={1} /> : <Copy strokeWidth={1} />}
        </Button>
      </div>
    )
  },
)

SecretInput.displayName = 'SecretInput'

export { SecretInput }
