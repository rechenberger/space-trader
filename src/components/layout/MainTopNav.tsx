import { AgentSelector } from '@/app/auth/AgentSelector'
import { ShipSelector } from '@/app/auth/ShipSelector'
import { cn } from '@/lib/utils'
import { getSavedTokens } from '@/server/auth'

export async function MainTopNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const savedTokens = await getSavedTokens()
  return (
    <nav
      className={cn(
        'flex flex-1 flex-wrap items-center gap-4 lg:gap-6',
        className,
      )}
      {...props}
    >
      <div className="flex-1" />
      {savedTokens.length ? <AgentSelector /> : null}
      {savedTokens.length ? <ShipSelector /> : null}
    </nav>
  )
}
