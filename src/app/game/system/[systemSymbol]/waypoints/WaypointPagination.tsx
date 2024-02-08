'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { range } from 'lodash-es'
import { ParamsLink } from './ParamsLink'

export const WaypointPagination = ({
  value,
  max,
}: {
  value: number
  max: number
}) => {
  const allPages = range(1, max + 1)
  return (
    <>
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <ParamsLink
              params={{
                page: Math.max(1, value - 1).toString(),
              }}
            >
              <PaginationPrevious
                className={cn(
                  value <= 1 &&
                    'text-muted hover:bg-transparent cursor-auto hover:text-muted',
                )}
              />
            </ParamsLink>
          </PaginationItem>
          {allPages.map((page) => (
            <PaginationItem key={page}>
              <ParamsLink
                params={{
                  page: page.toString(),
                }}
              >
                <PaginationLink isActive={page === value}>
                  {page}
                </PaginationLink>
              </ParamsLink>
            </PaginationItem>
          ))}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <ParamsLink
              params={{
                page: Math.min(max, value + 1).toString(),
              }}
            >
              <PaginationNext
                className={cn(
                  value >= max &&
                    'text-muted hover:bg-transparent cursor-auto hover:text-muted',
                )}
              />
            </ParamsLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
