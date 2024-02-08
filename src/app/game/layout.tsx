import { api } from '@/server/api'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: myAgent } = await api.agents.getMyAgent()

  await api.agents.getMyAgent()

  return (
    <>
      <div className="flex flex-row gap-8">
        <h2>{myAgent.symbol}</h2>
        <div className="flex-1" />
        <div>Generated: {new Date().toISOString()}</div>
        <div className="flex-1" />
        <div>Credits: {myAgent.credits}</div>
      </div>
      <div className="flex flex-row gap-8">
        <nav className="flex flex-col gap-2">
          <Link href="/game">Game</Link>
          <Link href="/game/ships">Ships</Link>
          <Link href="/game/shipyards">Shipyards</Link>
          <Link href="/game/contracts">Contracts</Link>
          <Link href="/game/dev">Dev</Link>
        </nav>
        <div className="">{children}</div>
      </div>
    </>
  )
}
