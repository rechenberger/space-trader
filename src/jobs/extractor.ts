import { api } from '@/server/api'
import { runTaskSuperjson } from '@/server/runTaskSuperjson'
import { client } from '@/trigger'
import { eventTrigger } from '@trigger.dev/sdk'
import { first, orderBy, take } from 'lodash-es'

client.defineJob({
  id: 'extractor-job',
  name: 'Extractor Job',
  version: '0.0.1',
  trigger: eventTrigger({
    name: 'extractor.event',
  }),
  run: async (payload, io, ctx) => {
    const shipSymbol = 'TINGO-3'
    await io.logger.info(`Starting the extractor job for ship ${shipSymbol}`)

    await (async () => {
      const { data: ship } = await runTaskSuperjson(io, 'getShip', async () =>
        api.fleet.getMyShip({
          shipSymbol,
        }),
      )

      const arrivalTime = ship.nav.route.arrival
      if (arrivalTime.getTime() > Date.now()) {
        await io.logger.info(
          `The ship ${shipSymbol} is still traveling to ${ship.nav.route.destination}`,
        )
        const secondsToWait = Math.ceil(
          (arrivalTime.getTime() - Date.now()) / 1000,
        )
        await io.wait('Waiting for the ship to arrive', secondsToWait)
        return
      }

      if (ship.cooldown.remainingSeconds > 0) {
        await io.logger.info(
          `The ship ${shipSymbol} is still on cooldown for ${ship.cooldown.remainingSeconds} seconds`,
        )
        await io.wait(
          'Waiting for the cooldown',
          ship.cooldown.remainingSeconds,
        )
        return
      }

      const currentWaypointNav = ship.nav.route.destination

      const { data: currentWaypoint } = await runTaskSuperjson(
        io,
        'getCurrentWaypoint',
        async () =>
          api.systems.getWaypoint({
            systemSymbol: currentWaypointNav.systemSymbol,
            waypointSymbol: currentWaypointNav.symbol,
          }),
      )

      let docked = ship.nav.status === 'DOCKED'

      // refuel?
      await io.logger.info(`Fuel: ${ship.fuel.current}/${ship.fuel.capacity}`)
      if (ship.fuel.current < 20) {
        if (!docked) {
          await runTaskSuperjson(io, 'dockShipBeforeRefuel', async () =>
            api.fleet.dockShip({
              shipSymbol,
            }),
          )
          docked = true
        }
        await io.logger.info(`Refueling`)
        await runTaskSuperjson(io, 'refuelShip', async () =>
          api.fleet.refuelShip({
            shipSymbol,
          }),
        )
      }

      // Try mining
      if (currentWaypoint.type === 'ENGINEERED_ASTEROID') {
        await io.logger.info(
          `Cargo: ${ship.cargo.units}/${ship.cargo.capacity}`,
        )
        if (ship.cargo.units < ship.cargo.capacity) {
          // make sure to be in orbit
          if (docked) {
            await io.logger.info(`Orbiting`)
            await runTaskSuperjson(io, 'orbitShipBeforeExtracting', async () =>
              api.fleet.orbitShip({
                shipSymbol,
              }),
            )
            docked = false
          }

          await io.logger.info(`Extracting more resources`)

          // Extract resources
          const { data: extractResult } = await runTaskSuperjson(
            io,
            'extractResources',
            async () =>
              api.fleet.extractResources({
                shipSymbol,
              }),
          )

          // Wait for cooldown
          const cooldown = extractResult.cooldown.remainingSeconds
          await io.wait('Waiting for cooldown', cooldown)

          return
        }
        await io.logger.info(
          `The ship is full and cannot extract any more resources`,
        )
      }

      // Try trading
      const sellableResources = await runTaskSuperjson(
        io,
        'getSellableResources',
        async () =>
          getTradeableResources({
            waypointSymbol: currentWaypointNav.symbol,
          }),
      )
      const resourcesToSell = ship.cargo.inventory.filter((i) =>
        sellableResources.includes(i.symbol),
      )
      if (resourcesToSell.length) {
        if (!docked) {
          await runTaskSuperjson(io, 'dockShipBeforeSelling', async () =>
            api.fleet.dockShip({
              shipSymbol,
            }),
          )
          docked = true
        }
        await io.logger.info(
          `Selling resources: ${resourcesToSell
            .map((i) => i.symbol)
            .join(', ')}`,
        )
        for (const resource of resourcesToSell) {
          await runTaskSuperjson(
            io,
            `sellingResource-${resource.symbol}`,
            async () =>
              api.fleet.sellCargo({
                shipSymbol,
                sellCargoRequest: {
                  symbol: resource.symbol,
                  units: resource.units,
                },
              }),
          )
        }
        return
      }

      // Fly to next planet
      const resourceToSell = ship.cargo.inventory.find(() => true)
      let nextWaypoint: string
      if (resourceToSell) {
        await io.logger.info(
          `Looking for a waypoint to sell ${resourceToSell.symbol}`,
        )

        const waypoints = await runTaskSuperjson(
          io,
          'getMarketWaypoints',
          async () => {
            const waypointsRaw = (
              await Promise.all([
                (
                  await api.systems.getSystemWaypoints({
                    systemSymbol: getSystemSymbol(currentWaypointNav.symbol),
                    limit: 20,
                    traits: 'MARKETPLACE',
                    page: 1,
                  })
                ).data,
                (
                  await api.systems.getSystemWaypoints({
                    systemSymbol: getSystemSymbol(currentWaypointNav.symbol),
                    limit: 20,
                    traits: 'MARKETPLACE',
                    page: 2,
                  })
                ).data,
              ])
            ).flat()

            const waypoints = await Promise.all(
              waypointsRaw.map(async (waypoint) => {
                // const market = (
                //   await api.systems.getMarket({
                //     systemSymbol: waypoint.systemSymbol,
                //     waypointSymbol: waypoint.symbol,
                //   })
                // ).data
                const tradeableResources = await getTradeableResources({
                  waypointSymbol: waypoint.symbol,
                })
                return {
                  waypoint,
                  tradeableResources,
                }
              }),
            )

            return waypoints
          },
        )

        let waypointsWithResource = waypoints.filter((w) =>
          w.tradeableResources.includes(resourceToSell.symbol),
        )
        waypointsWithResource = orderBy(
          waypointsWithResource,
          (w) => {
            const fromX = currentWaypointNav.x
            const fromY = currentWaypointNav.y
            const toX = w.waypoint.x
            const toY = w.waypoint.y
            const distance = Math.sqrt(
              Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2),
            )
            return distance
          },
          'asc',
        )
        const waypointToSell = first(waypointsWithResource)
        if (!waypointToSell) {
          throw new Error(
            `No waypoints found to sell the resource ${resourceToSell.symbol}`,
          )
        }
        nextWaypoint = waypointToSell.waypoint.symbol
      } else {
        await io.logger.info(`Looking for a astroid to mine`)
        nextWaypoint = 'X1-KN33-BX5X'
      }

      // Fly back to astroid
      await io.logger.info(`Navigating to the next waypoint ${nextWaypoint}`)
      if (docked) {
        await runTaskSuperjson(io, 'orbitShipBeforeNavigating', async () =>
          api.fleet.orbitShip({
            shipSymbol,
          }),
        )
        docked = false
      }

      const { data: navResult } = await runTaskSuperjson(
        io,
        'navigateShip',
        async () =>
          api.fleet.navigateShip({
            shipSymbol,
            navigateShipRequest: {
              waypointSymbol: nextWaypoint,
            },
          }),
      )

      const secondsToWait = Math.ceil(
        (navResult.nav.route.arrival.getTime() - Date.now()) / 1000,
      )
      await io.wait('Waiting for the ship to arrive', secondsToWait)
    })()

    await io.sendEvent('retrigger event', {
      name: 'extractor.event',
      payload: {},
    })
  },
})

const getTradeableResources = async ({
  waypointSymbol,
}: {
  waypointSymbol: string
}) => {
  const market = (
    await api.systems.getMarket({
      systemSymbol: getSystemSymbol(waypointSymbol),
      waypointSymbol,
    })
  ).data

  const sellableResources = [
    market.exchange.map((i) => i.symbol),
    market.imports.map((i) => i.symbol),
    market.tradeGoods?.map((i) => i.symbol) || [],
  ].flat()

  return sellableResources
}

const getSystemSymbol = (waypointSymbol: string) => {
  return take(waypointSymbol.split('-'), 2).join('-')
}
