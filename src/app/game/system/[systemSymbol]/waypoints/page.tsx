import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { initAgentApi } from '@/server/initAgentApi'
import { capitalCase } from 'change-case'
import { revalidatePath } from 'next/cache'
import { WaypointType } from '../../../../../../packages/spacetraders-sdk/src'
import { TraitSelect } from './TraitSelect'
import { WaypointPagination } from './WaypointPagination'
import { WaypointTypeSelect } from './WaypointTypeSelect'
import { defaultTrait } from './traits'

export default async function Page({
  params,
  searchParams,
}: {
  params: { systemSymbol: string }
  searchParams: {
    trait?: string
    page?: string
    type?: WaypointType
  }
}) {
  const api = await initAgentApi()

  const systemSymbol = params.systemSymbol
  const trait = searchParams.trait ?? defaultTrait
  const type = searchParams.type
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { data: waypointsRaw, meta: pageInfo } =
    await api.systems.getSystemWaypoints({
      systemSymbol,
      limit: 20,
      traits: trait,
      type,
      page,
    })

  const waypoints = await Promise.all(
    waypointsRaw.map(async (waypoint) => {
      const { data: market } = await api.systems.getMarket({
        systemSymbol: waypoint.systemSymbol,
        waypointSymbol: waypoint.symbol,
      })
      return {
        waypoint,
        market,
      }
    }),
  )

  return (
    <>
      <div className="flex flex-col lg:flex-row -mb-4 items-center gap-4">
        <TraitSelect value={trait} />
        <WaypointTypeSelect value={type} />
        <div className="flex-1"></div>
        <WaypointPagination
          value={page}
          max={Math.ceil(pageInfo.total / pageInfo.limit)}
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {waypoints.map((w) => (
          <Card
            key={w.waypoint.symbol}
            className="p-4 text-xs flex flex-col gap-2"
          >
            <div className="flex flex-row justify-between">
              <div className="font-bold flex-1">{w.waypoint.symbol}</div>
              <div className="text-muted-foreground">
                {w.waypoint.x},{w.waypoint.y}
              </div>
              <div className="text-muted-foreground flex-1 text-right">
                {capitalCase(w.waypoint.type)}
              </div>
            </div>
            <div className="line-clamp-3 h-12">
              {w.waypoint.traits.map((t) => t.name).join(', ')}
            </div>
            {w.market && (
              <>
                <hr className="my-2" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="font-bold text-center">Market</div>
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    {!!w.market.imports.length && (
                      <>
                        <span className="">Imports</span>
                        <span className="text-muted-foreground">
                          {w.market.imports?.map((t) => t.name).join(', ')}
                        </span>
                      </>
                    )}
                    {!!w.market.exports.length && (
                      <>
                        <span className="">Exports</span>
                        <span className="text-muted-foreground">
                          {w.market.exports?.map((t) => t.name).join(', ')}
                        </span>
                      </>
                    )}
                    {!!w.market.exchange.length && (
                      <>
                        <span className="">Exchange</span>
                        <span className="text-muted-foreground">
                          {w.market.exchange?.map((t) => t.name).join(', ')}
                        </span>
                      </>
                    )}
                    {!!w.market.tradeGoods?.length && (
                      <>
                        <span className="">TradeGoods</span>
                        <span className="text-muted-foreground">
                          {w.market.tradeGoods?.map((t) => t.symbol).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            <hr className="my-2" />
            <div className="flex flex-row justify-end">
              <form
                action={async () => {
                  'use server'
                  const shipSymbol = 'TINGO-3'
                  const result = await api.fleet.navigateShip({
                    shipSymbol,
                    navigateShipRequest: {
                      waypointSymbol: w.waypoint.symbol,
                    },
                  })
                  console.log('set waypoint result', result)
                  revalidatePath('/game')
                }}
              >
                <Button type="submit" variant="secondary" size="sm">
                  Navigate
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
