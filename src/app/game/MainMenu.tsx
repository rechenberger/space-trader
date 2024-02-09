import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { take } from 'lodash-es'
import Link from 'next/link'
import { Agent } from '../../../packages/spacetraders-sdk/src'

export const MainMenu = async ({
  myAgent,
  className,
}: {
  myAgent: Agent
  className?: string
}) => {
  const waypointSymbol = myAgent.headquarters
  const systemSymbol = take(waypointSymbol.split('-'), 2).join('-')
  return (
    <>
      <nav className={cn('flex flex-col', className)}>
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Agent <span className="text-muted-foreground">{myAgent.symbol}</span>
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
    </>
  )
}
