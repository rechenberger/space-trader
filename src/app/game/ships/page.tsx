import { Card } from '@/components/ui/card'
import { getSavedToken } from '@/server/auth'
import { MyShips } from './MyShips'
import { StartExtractor } from './StartExtractor'

export default async function Page() {
  const savedToken = await getSavedToken()
  const canAutomate = savedToken.agentSymbol === process.env.ST_AGENT_SYMBOL
  return (
    <>
      {canAutomate && (
        <Card className="p-4 flex flex-row justify-between items-center bg-muted">
          <h2>Automation</h2>
          <StartExtractor />
        </Card>
      )}
      <MyShips />
    </>
  )
}
