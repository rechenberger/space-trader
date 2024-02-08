'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ParamsLink, useChangeSearchParams } from './ParamsLink'

export const TraitSelect = ({ value }: { value?: string }) => {
  const changeSearchParams = useChangeSearchParams()
  return (
    <>
      <Select
        value={value ?? 'ALL'}
        onValueChange={(value) => {
          changeSearchParams({ trait: value }).push()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Traits" />
        </SelectTrigger>
        <SelectContent>
          <ParamsLink params={{ trait: null }}>
            <SelectItem value="ALL">All traits</SelectItem>
          </ParamsLink>
          <ParamsLink params={{ trait: 'MARKETPLACE' }}>
            <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
          </ParamsLink>
        </SelectContent>
      </Select>
    </>
  )
}
