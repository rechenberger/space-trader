import { Card } from '@/components/ui/card'
import { isAllowedToAutomate } from '@/server/isAllowedToAutomate'
import { MyShips } from './MyShips'
import { StartExtractor } from './StartExtractor'

export default async function Page() {
  const canAutomate = await isAllowedToAutomate()
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
