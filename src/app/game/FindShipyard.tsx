import { api } from '@/server/api'

export const FindShipyard = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
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
      <h2>Shipyards</h2>
      {/* <pre>{JSON.stringify(shipyards, null, 2)}</pre> */}
      {shipyards.map((shipyard) => (
        <div key={shipyard.waypoint.symbol}>
          <h3>{shipyard.waypoint.symbol}</h3>
          <h2>
            {shipyard.waypoint.type} at ({shipyard.waypoint.x},{' '}
            {shipyard.waypoint.y})
          </h2>
          <h2>
            Shiptypes:{' '}
            {shipyard.shipyard.shipTypes.map((t) => t.type).join(', ')}
          </h2>
          <h2>modificationsFee: {shipyard.shipyard.modificationsFee}</h2>
          {/* <pre>SHIPS: {JSON.stringify(shipyard.shipyard.ships, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(shipyard.shipyard.transactions, null, 2)}</pre> */}
          <h2>Ships:</h2>
          {shipyard.shipyard.ships?.map((ship, idx) => (
            <div key={idx} className="border p-2">
              <h3>{ship.name}</h3>
              <h2>Price: {ship.purchasePrice}</h2>
              {/* <h2>Modifications:</h2>
              <pre>{JSON.stringify(ship.modifications, null, 2)}</pre> */}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
