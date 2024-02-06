import { api } from '@/server/api'
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
      const ship = (
        await api.fleet.getMyShip({
          shipSymbol,
        })
      ).data

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

      const currentWaypoint = (
        await api.systems.getWaypoint({
          systemSymbol: currentWaypointNav.systemSymbol,
          waypointSymbol: currentWaypointNav.symbol,
        })
      ).data

      let docked = ship.nav.status === 'DOCKED'

      // refuel?
      await io.logger.info(`Fuel: ${ship.fuel.current}/${ship.fuel.capacity}`)
      if (ship.fuel.current < 20) {
        if (!docked) {
          await api.fleet.dockShip({
            shipSymbol,
          })
          docked = true
        }
        await io.logger.info(`Refueling`)
        await api.fleet.refuelShip({
          shipSymbol,
        })
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
            await api.fleet.orbitShip({
              shipSymbol,
            })
            docked = false
          }

          await io.logger.info(`Extracting more resources`)
          // Extract resources
          const extractResult = (
            await api.fleet.extractResources({
              shipSymbol,
            })
          ).data

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
      const sellableResources = await getTradeableResources({
        waypointSymbol: currentWaypointNav.symbol,
      })
      const resourcesToSell = ship.cargo.inventory.filter((i) =>
        sellableResources.includes(i.symbol),
      )
      if (resourcesToSell.length) {
        if (!docked) {
          await api.fleet.dockShip({
            shipSymbol,
          })
          docked = true
        }
        await io.logger.info(
          `Selling resources: ${resourcesToSell
            .map((i) => i.symbol)
            .join(', ')}`,
        )
        await Promise.all(
          resourcesToSell.map((resource) => {
            return api.fleet.sellCargo({
              shipSymbol,
              sellCargoRequest: {
                symbol: resource.symbol,
                units: resource.units,
              },
            })
          }),
        )
        io.wait('Waiting after selling to prevent rate limit', 2)
        return
      }

      // Fly to next planet
      const resourceToSell = ship.cargo.inventory.find(() => true)
      let nextWaypoint: string
      if (resourceToSell) {
        await io.logger.info(
          `Looking for a waypoint to sell ${resourceToSell.symbol}`,
        )
        const waypointsRaw = await api.systems.getSystemWaypoints({
          systemSymbol: getSystemSymbol(currentWaypointNav.symbol),
          limit: 20,
          traits: 'MARKETPLACE',
          page: 1,
        })

        const waypoints = await Promise.all(
          waypointsRaw.data.map(async (waypoint) => {
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
        await api.fleet.orbitShip({
          shipSymbol,
        })
        docked = false
      }
      const navResult = (
        await api.fleet.navigateShip({
          shipSymbol,
          navigateShipRequest: {
            waypointSymbol: nextWaypoint,
          },
        })
      ).data
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
