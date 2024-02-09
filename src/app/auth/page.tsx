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
import { login } from './auth'

export default async function Page() {
  return (
    <>
      <h1>Auth</h1>

      <div className="grid grid-cols-2 gap-4">
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
                <Input name="token" type="text" placeholder="Token" />
              </Label>
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
