import { api } from '@/server/api'
import { take } from 'lodash-es'
import { FindShipyard } from './FindShipyard'

export default async function Page() {
  const myAgent = await api.agents.getMyAgent()
  const waypointSymbol = myAgent.data.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')

  return (
    <>
      <FindShipyard systemSymbol={systemSymbol} />
    </>
  )
}
