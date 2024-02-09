import { SubmitButton } from '@/components/app/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { initAgentApi } from '@/server/initAgentApi'
import { capitalCase } from 'change-case'
import { revalidatePath } from 'next/cache'
import dynamic from 'next/dynamic'
import { Fragment } from 'react'

const CooldownButton = dynamic(() => import('./CooldownButton'), {
  ssr: false,
})

export const MyShips = async () => {
  const api = await initAgentApi()
  const ships = (await api.fleet.getMyShips()).data
  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        {ships.map((ship, idx) => (
          <Card key={idx} className="p-4 flex flex-col gap-2 text-sm">
            <div className="flex flex-row justify-between">
              <div className="font-bold">{ship.symbol}</div>
              <div className="text-muted-foreground">
                {capitalCase(ship.registration.role)}
              </div>
            </div>
            <div
              className="line-clamp-1 text-muted-foreground"
              title={ship.modules.map((m) => m.name).join(', ') || 'No Modules'}
            >
              {ship.modules.map((m) => m.name).join(', ') || 'No Modules'}
            </div>
            <hr className="" />
            <div className="flex flex-row justify-between">
              <div className="">
                Fuel:{' '}
                <span className="text-muted-foreground">
                  {ship.fuel.current}/{ship.fuel.capacity}
                </span>
              </div>
              {!!ship.crew.capacity && (
                <div className="">
                  Crew:{' '}
                  <span className="text-muted-foreground">
                    {ship.crew.current}/{ship.crew.capacity}
                  </span>
                </div>
              )}
            </div>
            <div className="truncate flex flex-col lg:flex-row justify-between gap-2">
              {capitalCase(ship.nav.status)}{' '}
              <span className="text-muted-foreground">
                @ {ship.nav.route.destination.symbol} (
                {capitalCase(ship.nav.route.destination.type)})
              </span>
            </div>
            {/* <div>
              Arrival:{' '}
              <LocalDateTime datetime={ship.nav.route.arrival.toISOString()} />
            </div> */}

            <hr className="" />
            <div className="flex flex-row justify-between">
              <div>Cargo</div>
              <div className="text-muted-foreground">
                {ship.cargo.units} / {ship.cargo.capacity}
              </div>
            </div>
            {ship.cargo.inventory.map((item, idx) => (
              <div key={idx} className="border rounded-md flex flex-row gap-4">
                <h3 className="flex-1 p-2" title={item.description}>
                  {item.units}x {item.name}
                </h3>
                <form
                  action={async () => {
                    'use server'
                    const api = await initAgentApi()
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
                  <Button type="submit" variant="secondary" size="sm">
                    Sell
                  </Button>
                </form>
              </div>
            ))}
            <div className="flex-1"></div>
            <hr className="" />
            <div className="flex flex-row justify-end gap-2">
              <form
                action={async () => {
                  'use server'
                  const api = await initAgentApi()
                  if (ship.nav.status === 'DOCKED') {
                    await api.fleet.orbitShip({
                      shipSymbol: ship.symbol,
                    })
                  } else {
                    await api.fleet.dockShip({
                      shipSymbol: ship.symbol,
                    })
                  }
                  revalidatePath('/game')
                }}
              >
                <CooldownButton
                  expiration={ship.nav.route.arrival}
                  variant="secondary"
                  size="sm"
                >
                  {ship.nav.status === 'DOCKED' ? 'Orbit' : 'Dock'}
                </CooldownButton>
              </form>
              <form
                action={async () => {
                  'use server'
                  const api = await initAgentApi()
                  const result = await api.fleet.refuelShip({
                    shipSymbol: ship.symbol,
                  })
                  console.log('result', result)
                  revalidatePath('/game')
                }}
              >
                <SubmitButton variant="secondary" size="sm">
                  Refuel
                </SubmitButton>
              </form>
              <form
                action={async () => {
                  'use server'
                  const api = await initAgentApi()
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
                    size="sm"
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
