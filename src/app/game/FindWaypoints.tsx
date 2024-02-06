import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'

export const FindWaypoints = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
  const waypointsRaw = await api.systems.getSystemWaypoints({
    systemSymbol,
    limit: 20,
    traits: 'MARKETPLACE',
    page: 1,
  })

  const shipSymbol = 'TINGO-3'

  const waypoints = await Promise.all(
    waypointsRaw.data.map(async (waypoint) => {
      const market = (
        await api.systems.getMarket({
          systemSymbol: waypoint.systemSymbol,
          waypointSymbol: waypoint.symbol,
        })
      ).data
      return {
        waypoint,
        market,
      }
    }),
  )

  return (
    <>
      <h2>Waypoints</h2>
      <pre>{JSON.stringify(waypointsRaw.meta, null, 2)}</pre>
      <div className="grid grid-cols-3 gap-4">
        {waypoints.map(({ waypoint, market }, idx) => (
          <div key={idx} className="border p-2">
            <h3>{waypoint.symbol}</h3>
            <pre>
              {JSON.stringify(
                {
                  type: waypoint.type,
                  x: waypoint.x,
                  y: waypoint.y,
                  // orbitals: waypoint.orbitals.map((o) => o.symbol).join(', '),
                },
                null,
                2,
              )}
            </pre>
            {waypoint.traits.map((t) => t.name).join(', ')}
            {market && (
              <>
                <div>
                  Imports: {market.imports?.map((t) => t.symbol).join(', ')}
                </div>
                <div>
                  Exports: {market.exports?.map((t) => t.symbol).join(', ')}
                </div>
                <div>
                  Exchange: {market.exchange?.map((t) => t.symbol).join(', ')}
                </div>
                <div>
                  TradeGoods:{' '}
                  {market.tradeGoods?.map((t) => t.symbol).join(', ')}
                </div>
              </>
            )}
            <form
              action={async () => {
                'use server'
                const result = await api.fleet.navigateShip({
                  shipSymbol,
                  navigateShipRequest: {
                    waypointSymbol: waypoint.symbol,
                  },
                })
                console.log('set waypoint result', result)
                revalidatePath('/game')
              }}
            >
              <Button type="submit">Navigate</Button>
            </form>
          </div>
        ))}
      </div>
    </>
  )
}
