'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { capitalCase } from 'change-case'
import { ParamsLink, useChangeSearchParams } from './ParamsLink'
import { allTraits, traitsFeatured } from './traits'

export const TraitSelect = ({ value }: { value?: string }) => {
  const changeSearchParams = useChangeSearchParams()
  return (
    <>
      <Select
        value={value ?? 'ALL'}
        onValueChange={(value) => {
          const trait = value === 'ALL' ? null : value
          changeSearchParams({ trait }).push()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Traits" />
        </SelectTrigger>
        <SelectContent>
          {/* <ParamsLink params={{ trait: null }}>
            <SelectItem value="ALL">All traits</SelectItem>
          </ParamsLink> */}
          {traitsFeatured.map((trait) => (
            <ParamsLink key={trait} params={{ trait }}>
              <SelectItem value={trait}>{capitalCase(trait)}</SelectItem>
            </ParamsLink>
          ))}
          <hr className="my-2" />
          {allTraits
            .filter((t) => !traitsFeatured.includes(t as any))
            .map((trait) => (
              <ParamsLink key={trait} params={{ trait }}>
                <SelectItem value={trait}>{capitalCase(trait)}</SelectItem>
              </ParamsLink>
            ))}
        </SelectContent>
      </Select>
    </>
  )
}
