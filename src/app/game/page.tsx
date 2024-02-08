import { api } from '@/server/api'
import { take } from 'lodash-es'
import { StartExtractor } from './ships/StartExtractor'

// export const dynamic = 'force-dynamic'

export default async function Page() {
  const myAgent = await api.agents.getMyAgent()
  const waypointSymbol = myAgent.data.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')

  await api.agents.getMyAgent()

  return (
    <>
      <StartExtractor />
      <pre>
        <code>{JSON.stringify(myAgent, null, 2)}</code>
      </pre>
    </>
  )
}
