import { api } from '@/server/api'
import { take } from 'lodash-es'
import { Contracts } from './Contracts'
import { FindShipyard } from './FindShipyard'

export const headers = {
  Authorization: `Bearer ${process.env.ST_TOKEN}`,
  'Content-Type': 'application/json',
}

export default async function Page() {
  const myAgent = await fetch('https://api.spacetraders.io/v2/my/agent', {
    headers,
  }).then((res) => res.json())

  const headquarters = myAgent.data.headquarters
  const systemSymbol = take(headquarters.split('-'), 2).join('-')

  const startingLocation = await fetch(
    `https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints/${headquarters}`,
    {
      headers,
    },
  ).then((res) => res.json())

  const myContracts = await fetch(
    `https://api.spacetraders.io/v2/my/contracts`,
    {
      headers,
    },
  ).then((res) => res.json())

  await api.agents.getMyAgent()

  return (
    <>
      <h2>Game</h2>
      <pre>
        <code>{JSON.stringify(myAgent, null, 2)}</code>
        <code>
          {JSON.stringify(
            { headquarters, systemSymbol, startingLocation, myContracts },
            null,
            2,
          )}
        </code>
      </pre>
      <hr />
      <Contracts />
      <hr />
      <FindShipyard systemSymbol={systemSymbol} />
    </>
  )
}
