import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { omit } from 'lodash-es'
import { revalidatePath } from 'next/cache'

export const FindAsteroids = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
  const waypoints = await api.systems.getSystemWaypoints({
    systemSymbol,
    type: 'ENGINEERED_ASTEROID',
  })

  const shipSymbol = 'TINGO-3'

  const astroids = await Promise.all(
    waypoints.data.map(async (waypoint) => {
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
      <h2>ASTROIDS</h2>
      {astroids.map(({ waypoint, market }, idx) => (
        <div key={idx} className="border p-2">
          <h3>{waypoint.symbol}</h3>
          <pre>
            {JSON.stringify(
              {
                waypoint,
                market: omit(market, ['transactions']),
              },
              null,
              2,
            )}
          </pre>
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
    </>
  )
}
