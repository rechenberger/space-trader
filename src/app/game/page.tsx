import { api } from '@/server/api'
import { take } from 'lodash-es'
import { Contracts } from './Contracts'
import { FindAsteroids } from './FindAsteroids'
import { FindShipyard } from './FindShipyard'
import { FindWaypoints } from './FindWaypoints'
import { MyShips } from './MyShips'
import { StartExtractor } from './StartExtractor'

export default async function Page() {
  const myAgent = await api.agents.getMyAgent()

  const waypointSymbol = myAgent.data.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')

  // const startingLocation = await api.systems.getWaypoint({
  //   systemSymbol,
  //   waypointSymbol,
  // })

  await api.agents.getMyAgent()

  return (
    <>
      <h2>Game</h2>
      <StartExtractor />
      <pre>
        <code>{JSON.stringify(myAgent, null, 2)}</code>
        {/* <code>
          {JSON.stringify(
            { waypointSymbol, systemSymbol, startingLocation },
            null,
            2,
          )}
        </code> */}
      </pre>
      <hr />
      <MyShips />
      <hr />
      <Contracts />
      <hr />
      <FindShipyard systemSymbol={systemSymbol} />
      <hr />
      <FindAsteroids systemSymbol={systemSymbol} />
      <hr />
      <FindWaypoints systemSymbol={systemSymbol} />
    </>
  )
}
