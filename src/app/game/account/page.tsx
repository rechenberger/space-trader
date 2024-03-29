import { SavedTokenDetails } from '@/app/auth/SavedTokenDetails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSavedToken } from '@/server/auth'

export default async function Page() {
  const savedToken = await getSavedToken()
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Agent{' '}
            <span className="text-muted-foreground">
              {savedToken.agentSymbol}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SavedTokenDetails
            t={savedToken}
            showAccountId
            showToken
            className="text-xs"
          />
        </CardContent>
      </Card>
    </>
  )
}
