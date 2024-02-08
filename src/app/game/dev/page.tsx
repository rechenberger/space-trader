import { api } from '@/server/api'
import { take } from 'lodash-es'
import { FindAsteroids } from './FindAsteroids'
import { FindWaypoints } from './FindWaypoints'
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
      <FindAsteroids systemSymbol={systemSymbol} />
      <hr />
      <FindWaypoints systemSymbol={systemSymbol} />
    </>
  )
}
