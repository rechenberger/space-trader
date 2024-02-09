import { LocalTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatNumber } from '@/lib/formatNumber'
import { getToken } from '@/server/auth'
import { initAgentApi } from '@/server/initAgentApi'
import { Menu } from 'lucide-react'
import { redirect } from 'next/navigation'
import { MainMenu } from './MainMenu'

export const dynamic = 'force-dynamic'

export default async function Page({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getToken()
  if (!token) {
    redirect('/auth')
  }
  const api = await initAgentApi()
  const { data: myAgent } = await api.agents.getMyAgent()
  return (
    <>
      <div className="flex flex-row gap-4 lg:px-4 items-center text-sm text-muted-foreground -my-4">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <MainMenu myAgent={myAgent} className="w-full" />
          </PopoverContent>
        </Popover>
        <div className="flex-1" />
        <div className="">
          <LocalTime datetime={new Date().toISOString()} />
        </div>
        <div>
          <strong>{formatNumber(myAgent.credits)}</strong> Credits
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <MainMenu myAgent={myAgent} className="max-lg:hidden w-48" />
        <div className="flex flex-col gap-8 flex-1">{children}</div>
      </div>
    </>
  )
}
