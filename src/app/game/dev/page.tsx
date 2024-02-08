import { api } from '@/server/api'
import { take } from 'lodash-es'
import { FindAsteroids } from './FindAsteroids'
import { FindShipyard } from './FindShipyard'
import { FindWaypoints } from './FindWaypoints'
import { MyShips } from './MyShips'
import { StartExtractor } from './StartExtractor'

// export const dynamic = 'force-dynamic'

export default async function Page() {
  const myAgent = await api.agents.getMyAgent()

  const waypointSymbol = myAgent.data.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')

  return (
    <>
      <StartExtractor />
      <hr />
      <MyShips />
      <hr />
      <FindShipyard systemSymbol={systemSymbol} />
      <hr />
      <FindAsteroids systemSymbol={systemSymbol} />
      <hr />
      <FindWaypoints systemSymbol={systemSymbol} />
    </>
  )
}
