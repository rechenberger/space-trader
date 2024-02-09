import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initAgentApi } from '@/server/initAgentApi'
import {
  getSelectedShipSymbol,
  setSelectedShipSymbol,
} from '@/server/selectedShipSymbol'
import { ChevronDown, Ship } from 'lucide-react'
import { Fragment } from 'react'

export const ShipSelector = async () => {
  const api = await initAgentApi()
  const { data: ships } = await api.fleet.getMyShips()
  const selectedShipSymbol = await getSelectedShipSymbol()
  const selectedShip = ships.find((s) => s.symbol === selectedShipSymbol)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className="flex flex-row gap-2">
            <Ship className="h-4 w-4" />
            <span>{selectedShip ? selectedShip.symbol : 'Select Ship'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {ships.map((s) => (
            <Fragment key={s.symbol}>
              <form
                action={async () => {
                  'use server'
                  await setSelectedShipSymbol({ selectedShipSymbol: s.symbol })
                }}
              >
                <button type="submit" className="w-full cursor-pointer">
                  <DropdownMenuCheckboxItem
                    checked={selectedShipSymbol === s.symbol}
                    className="cursor-pointer"
                  >
                    <div>{s.symbol}</div>
                  </DropdownMenuCheckboxItem>
                </button>
              </form>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
