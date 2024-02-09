import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/formatNumber'
import { initAgentApi } from '@/server/initAgentApi'
import { capitalCase } from 'change-case'
import { revalidatePath } from 'next/cache'

export const FindShipyard = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
  const api = await initAgentApi()

  const waypoints = await api.systems.getSystemWaypoints({
    systemSymbol,
    traits: 'SHIPYARD',
  })

  const shipyards = await Promise.all(
    waypoints.data.map(async (waypoint) => {
      const shipyard = (
        await api.systems.getShipyard({
          systemSymbol,
          waypointSymbol: waypoint.symbol,
        })
      ).data
      return {
        waypoint,
        shipyard,
      }
    }),
  )

  return (
    <>
      {shipyards.map((shipyard) => (
        <Card
          key={shipyard.waypoint.symbol}
          className="p-4 text-sm flex flex-col gap-2"
        >
          <div className="flex flex-row justify-between">
            <div className="font-bold flex-1">{shipyard.waypoint.symbol}</div>
            <div className="text-muted-foreground">
              {shipyard.waypoint.x},{shipyard.waypoint.y}
            </div>
            <div className="text-muted-foreground flex-1 text-right">
              {capitalCase(shipyard.waypoint.type)}
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <>
              <div className="">Shiptypes</div>
              <div className="text-muted-foreground">
                {shipyard.shipyard.shipTypes
                  .map((t) => capitalCase(t.type))
                  .join(', ')}
              </div>
            </>
            <>
              <div className="">Modification Fee</div>
              <div className="text-muted-foreground">
                {shipyard.shipyard.modificationsFee}
              </div>
            </>
          </div>

          {shipyard.shipyard.ships?.length ? (
            <>
              <br className="my-2" />
              <div className="grid grid-cols-3 gap-4">
                {shipyard.shipyard.ships?.map((ship, idx) => (
                  <Card key={idx} className="p-4 text-sm flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <strong>{ship.name}</strong>
                      <div className="text-muted-foreground">
                        {formatNumber(ship.purchasePrice)} Credits
                      </div>
                    </div>
                    <div className="text-xs">{ship.description}</div>
                    <hr className="my-2" />
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      <>
                        <div className="">Frame</div>
                        <div className="text-muted-foreground">
                          {ship.frame.name} ({ship.frame.fuelCapacity} Fuel)
                        </div>
                      </>
                      <>
                        <div className="">Reactor</div>
                        <div className="text-muted-foreground">
                          {ship.reactor.name} ({ship.reactor.powerOutput} Power)
                        </div>
                      </>
                      <>
                        <div className="">Engine</div>
                        <div className="text-muted-foreground">
                          {ship.engine.name} ({ship.engine.speed} Speed)
                        </div>
                      </>
                      <>
                        <div className="">Mounts</div>
                        <div className="text-muted-foreground">
                          {ship.mounts.map((m) => m.name).join(', ')}
                        </div>
                      </>
                    </div>
                    <hr className="my-2" />
                    <form
                      action={async () => {
                        'use server'
                        console.log('buying ship', ship.type)
                        const result = await api.fleet.purchaseShip({
                          purchaseShipRequest: {
                            shipType: ship.type,
                            waypointSymbol: shipyard.waypoint.symbol,
                          },
                        })
                        console.log('result', result)
                        revalidatePath('/game')
                      }}
                    >
                      <Button type="submit">Buy</Button>
                    </form>
                  </Card>
                ))}
              </div>
            </>
          ) : null}
        </Card>
      ))}
    </>
  )
}
