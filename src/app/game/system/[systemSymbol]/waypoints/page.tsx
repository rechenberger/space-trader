import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'

export default async function Page({
  params,
}: {
  params: { systemSymbol: string }
}) {
  const systemSymbol = params.systemSymbol

  const { data: waypointsRaw } = await api.systems.getSystemWaypoints({
    systemSymbol,
    limit: 20,
    traits: 'MARKETPLACE',
    page: 1,
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
      <div className="grid grid-cols-3 gap-4">
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
              <div className="text-muted-foreground capitalize flex-1 text-right">
                {w.waypoint.type.toLowerCase()}
              </div>
            </div>
            <div className="line-clamp-3 h-12">
              {w.waypoint.traits.map((t) => t.name).join(', ')}
            </div>
            {w.market && (
              <>
                <hr className="my-2" />
                <div className="flex-1">
                  <div className="font-bold">Market</div>
                  <div>
                    Imports: {w.market.imports?.map((t) => t.name).join(', ')}
                  </div>
                  <div>
                    Exports: {w.market.exports?.map((t) => t.name).join(', ')}
                  </div>
                  <div>
                    Exchange: {w.market.exchange?.map((t) => t.name).join(', ')}
                  </div>
                  <div>
                    TradeGoods:{' '}
                    {w.market.tradeGoods?.map((t) => t.symbol).join(', ')}
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
