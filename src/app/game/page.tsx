import { api } from '@/server/api'
import { take } from 'lodash-es'
import { Contracts } from './Contracts'
import { FindShipyard } from './FindShipyard'

export const headers = {
  Authorization: `Bearer ${process.env.ST_TOKEN}`,
  'Content-Type': 'application/json',
}

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
      <Contracts />
      <hr />
      <FindShipyard systemSymbol={systemSymbol} />
    </>
  )
}
