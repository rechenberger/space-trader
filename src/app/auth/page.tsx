import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { initApi } from '@/server/api'
import { getToken, login } from '@/server/auth'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  const token = await getToken()
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="flex-1">
          <div className="text-muted-foreground">Welcome to</div>
          <h1 className="text-3xl">SpaceTrader</h1>
        </div>
        {/* <AgentSelector /> */}
        {!!token && (
          <Link href="/game">
            <Button className="flex flex-row gap-2">
              <div>Jump back into Game</div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new Account</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              action={async (formData) => {
                'use server'
                const agentSymbol = formData.get('agentSymbol')
                if (!agentSymbol || typeof agentSymbol !== 'string') {
                  throw new Error('Agent Symbol is required')
                }
                const api = initApi({})
                const { data: registerResult } = await api.default.register({
                  registerRequest: {
                    faction: 'COSMIC',
                    symbol: agentSymbol,
                  },
                })
                const token = registerResult.token
                await login({ token })
              }}
            >
              <Label className="flex flex-col gap-2">
                <div>Agent Symbol</div>
                <Input
                  name="agentSymbol"
                  type="text"
                  placeholder="Name of your Agent"
                />
              </Label>
              <Button type="submit" variant={'secondary'}>
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Login with Token</CardTitle>
            <CardDescription>
              Login into an existing Agent with your token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              action={async (formData) => {
                'use server'
                const token = formData.get('token')
                if (!token || typeof token !== 'string') {
                  throw new Error('Token is required')
                }
                await login({ token })
              }}
            >
              <Label className="flex flex-col gap-2">
                <div>Token</div>
                <Input
                  name="token"
                  type="text"
                  placeholder="eyXXXXXXXXXXXXXXX"
                />
              </Label>
              <Button type="submit" variant={'secondary'}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
