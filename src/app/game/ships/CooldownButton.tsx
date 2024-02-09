'use client'

import { SubmitButton } from '@/components/app/SubmitButton'
import { ButtonProps } from '@/components/ui/button'
import { ReactNode, useEffect, useState } from 'react'

const CooldownButton = ({
  expiration,
  children,
  ...props
}: {
  expiration?: Date
  children?: ReactNode
} & ButtonProps) => {
  const [cd, setCd] = useState(
    expiration
      ? Math.max(Math.floor((expiration.getTime() - Date.now()) / 1000), 0)
      : 0,
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCd((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    if (expiration) {
      setCd(Math.max(Math.floor((expiration.getTime() - Date.now()) / 1000), 0))
    }
  }, [expiration])

  return (
    <>
      <SubmitButton type="submit" disabled={!!cd} {...props}>
        {children} {cd ? `(${cd}s)` : null}
      </SubmitButton>
    </>
  )
}

export default CooldownButton
