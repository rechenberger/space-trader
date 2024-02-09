import { LocalTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/formatNumber'
import { initAgentApi } from '@/server/initAgentApi'
import { take } from 'lodash-es'
import Link from 'next/link'
import { AgentSelector } from '../auth/AgentSelector'

export const dynamic = 'force-dynamic'

export default async function Page({
  children,
}: {
  children: React.ReactNode
}) {
  const api = await initAgentApi()
  const { data: myAgent } = await api.agents.getMyAgent()
  const waypointSymbol = myAgent.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')
  return (
    <>
      <div className="flex flex-row gap-4 px-4 items-center text-sm text-muted-foreground -my-4">
        <div className="flex-1" />
        <div className="">
          <LocalTime datetime={new Date().toISOString()} />
        </div>
        <div>
          <strong>{formatNumber(myAgent.credits)}</strong> Credits
        </div>
        <AgentSelector />
      </div>
      <div className="flex flex-row gap-8">
        <nav className="flex flex-col w-48">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Player{' '}
            <span className="text-muted-foreground">{myAgent.symbol}</span>
          </h2>
          <Link href="/game/ships">
            <Button variant="ghost" className="w-full justify-start">
              Ships
              <span className="text-muted-foreground">
                &nbsp;({myAgent.shipCount})
              </span>
            </Button>
          </Link>
          <Link href="/game/contracts">
            <Button variant="ghost" className="w-full justify-start">
              Contracts
            </Button>
          </Link>

          <h2 className="mt-8 mb-2 px-4 text-lg font-semibold tracking-tight">
            System <span className="text-muted-foreground">{systemSymbol}</span>
          </h2>
          <Link href={`/game/system/${systemSymbol}/waypoints`}>
            <Button variant="ghost" className="w-full justify-start">
              All Waypoints
            </Button>
          </Link>
          <Link href={`/game/system/${systemSymbol}/shipyards`}>
            <Button variant="ghost" className="w-full justify-start">
              Shipyards
            </Button>
          </Link>
        </nav>
        <div className="flex flex-col gap-8 flex-1">{children}</div>
      </div>
    </>
  )
}
