import { LocalDateTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'
import dynamic from 'next/dynamic'
import { Fragment } from 'react'

const CooldownButton = dynamic(() => import('./CooldownButton'), {
  ssr: false,
})

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
                fuel: ship.fuel,
                cargo: ship.cargo,
                crew: ship.crew.current,
                navStatus: ship.nav.status,
                destinationSymbol: ship.nav.route.destination.symbol,
                destinationType: ship.nav.route.destination.type,
                cooldown: ship.cooldown,
              },
              null,
              2,
            )}
          </pre>
          Arrival:{' '}
          <LocalDateTime datetime={ship.nav.route.arrival.toISOString()} />
          <div className="flex flex-row gap-4">
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
            <form
              action={async () => {
                'use server'
                const result = await api.fleet.refuelShip({
                  shipSymbol: ship.symbol,
                })
                console.log('result', result)
                revalidatePath('/game')
              }}
            >
              <Button type="submit">Refuel</Button>
            </form>
            <form
              action={async () => {
                'use server'
                const result = await api.fleet.extractResources({
                  shipSymbol: ship.symbol,
                })
                console.log('result', result)
                revalidatePath('/game')
              }}
            >
              <Fragment key={ship.cooldown.expiration?.toString()}>
                <CooldownButton expiration={ship.cooldown.expiration}>
                  Extract
                </CooldownButton>
              </Fragment>
            </form>
          </div>
        </div>
      ))}
    </>
  )
}
