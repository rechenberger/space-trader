'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { capitalCase } from 'change-case'
import { values } from 'lodash-es'
import { WaypointType } from '../../../../../../packages/spacetraders-sdk/src'
import { ParamsLink, useChangeSearchParams } from './ParamsLink'

const types = values(WaypointType)

export const WaypointTypeSelect = ({ value }: { value?: string }) => {
  const changeSearchParams = useChangeSearchParams()
  return (
    <>
      <Select
        value={value ?? 'ALL'}
        onValueChange={(value) => {
          const type = value === 'ALL' ? null : value
          changeSearchParams({ type }).push()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Types" />
        </SelectTrigger>
        <SelectContent>
          <ParamsLink params={{ type: null }}>
            <SelectItem value="ALL">All Types</SelectItem>
          </ParamsLink>
          {types.map((t) => (
            <ParamsLink key={t} params={{ type: t }}>
              <SelectItem value={t}>{capitalCase(t)}</SelectItem>
            </ParamsLink>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
