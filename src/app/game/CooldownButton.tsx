'use client'

import { Button } from '@/components/ui/button'
import { ReactNode, useEffect, useState } from 'react'

const CooldownButton = ({
  expiration,
  children,
}: {
  expiration?: Date
  children?: ReactNode
}) => {
  const [cd, setCd] = useState(
    expiration ? Math.floor((expiration.getTime() - Date.now()) / 1000) : 0,
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCd((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    if (expiration) {
      setCd(Math.floor((expiration.getTime() - Date.now()) / 1000))
    }
  }, [expiration])

  return (
    <>
      <Button type="submit" disabled={!!cd}>
        {children} {cd ? `(${cd}s cooldown)` : null}
      </Button>
    </>
  )
}

export default CooldownButton
