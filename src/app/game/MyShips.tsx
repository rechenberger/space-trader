import { LocalDateTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'

export const MyShips = async () => {
  const ships = (await api.fleet.getMyShips()).data
  return (
    <>
      {ships.map((ship, idx) => (
        <div key={idx} className="border p-2">
          <h3>{ship.symbol}</h3>
          <pre>
            {JSON.stringify(
              {
                role: ship.registration.role,
                modules: ship.modules.map((m) => m.name).join(', '),
                fuel: ship.fuel.current,
                cargo: ship.cargo,
                crew: ship.crew.current,
                navStatus: ship.nav.status,
                destinationSymbol: ship.nav.route.destination.symbol,
                destinationType: ship.nav.route.destination.type,
              },
              null,
              2,
            )}
          </pre>
          Arrival:{' '}
          <LocalDateTime datetime={ship.nav.route.arrival.toISOString()} />
          <form
            action={async () => {
              'use server'
              if (ship.nav.status === 'DOCKED') {
                const result = await api.fleet.orbitShip({
                  shipSymbol: ship.symbol,
                })
                console.log('orbit result', result)
              } else {
                const result = await api.fleet.dockShip({
                  shipSymbol: ship.symbol,
                })
                console.log('dock result', result)
              }
              revalidatePath('/game')
            }}
          >
            <Button type="submit">
              {ship.nav.status === 'DOCKED' ? 'Orbit' : 'Dock'}
            </Button>
          </form>
        </div>
      ))}
    </>
  )
}
