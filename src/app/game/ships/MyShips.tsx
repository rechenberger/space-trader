import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
      <div className="grid grid-cols-3 gap-4">
        {ships.map((ship, idx) => (
          <Card key={idx} className="p-4 flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <div className="font-bold">{ship.symbol}</div>
              <div className="text-muted-foreground">
                {ship.registration.role}
              </div>
            </div>
            <div
              className="text-xs truncate"
              title={ship.modules.map((m) => m.name).join(', ') || 'No Modules'}
            >
              {ship.modules.map((m) => m.name).join(', ') || 'No Modules'}
            </div>
            <div className="flex flex-row justify-between">
              <div className="">
                Fuel: {ship.fuel.current} / {ship.fuel.capacity}
              </div>
              {!!ship.crew.capacity && (
                <div className="">
                  Crew: {ship.crew.current} / {ship.crew.capacity}
                </div>
              )}
            </div>
            <div className="truncate">
              {ship.nav.status} @ {ship.nav.route.destination.symbol} (
              {ship.nav.route.destination.type})
            </div>
            {/* <div>
              Arrival:{' '}
              <LocalDateTime datetime={ship.nav.route.arrival.toISOString()} />
            </div> */}
            <hr />
            <h2>
              Cargo ({ship.cargo.units} / {ship.cargo.capacity})
            </h2>
            {ship.cargo.inventory.map((item, idx) => (
              <div key={idx} className="border rounded-md flex flex-row gap-4">
                <h3 className="flex-1 p-2" title={item.description}>
                  {item.units}x {item.name}
                </h3>
                <form
                  action={async () => {
                    'use server'
                    const result = await api.fleet.sellCargo({
                      shipSymbol: ship.symbol,
                      sellCargoRequest: {
                        symbol: item.symbol,
                        units: item.units,
                      },
                    })
                    console.log('result', result)
                    revalidatePath('/game')
                  }}
                >
                  <Button type="submit" variant="secondary">
                    Sell
                  </Button>
                </form>
              </div>
            ))}
            <div className="flex-1"></div>
            <hr />
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
                <CooldownButton
                  expiration={ship.nav.route.arrival}
                  variant="secondary"
                >
                  {ship.nav.status === 'DOCKED' ? 'Orbit' : 'Dock'}
                </CooldownButton>
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
                <Button type="submit" variant="secondary">
                  Refuel
                </Button>
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
                  <CooldownButton
                    expiration={ship.cooldown.expiration}
                    variant="secondary"
                  >
                    Extract
                  </CooldownButton>
                </Fragment>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
