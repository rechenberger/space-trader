import { Card } from '@/components/ui/card'
import { api } from '@/server/api'

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

  const waypoints = waypointsRaw.map((waypoint) => ({ waypoint }))

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {waypoints.map((w) => (
          <Card
            key={w.waypoint.symbol}
            className="p-4 text-xs flex flex-col gap-4"
          >
            <div className="flex flex-row justify-between">
              <div className="font-bold">{w.waypoint.symbol}</div>
              <div className="text-muted-foreground capitalize">
                {w.waypoint.type.toLowerCase()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
