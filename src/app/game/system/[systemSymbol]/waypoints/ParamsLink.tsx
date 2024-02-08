'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const ParamsLink = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Record<string, string | null>
}) => {
  const changeSearchParams = useChangeSearchParams()
  const { url } = changeSearchParams(params)
  return <Link href={url}>{children}</Link>
}

export const useChangeSearchParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams().toString()
  const router = useRouter()

  return (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    const url = `${pathname}?${newSearchParams.toString()}`

    return { url, push: () => router.push(url) }
  }
}
