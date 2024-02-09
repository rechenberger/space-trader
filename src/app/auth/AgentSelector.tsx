import { LocalDateTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, User, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { getSavedTokens, getToken, login } from './auth'

export const AgentSelector = async () => {
  const savedTokens = await getSavedTokens()
  const token = await getToken()
  const currentToken = savedTokens.find((t) => t.token === token)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={'outline'} className="flex flex-row gap-2">
            <User className="h-4 w-4" />
            <span>
              {currentToken ? currentToken.agentSymbol : 'Select Agent'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {savedTokens.map((t) => (
            <Fragment key={t.token}>
              <form
                action={async () => {
                  'use server'
                  await login({ token: t.token })
                }}
              >
                <button type="submit" className="w-full cursor-pointer">
                  <DropdownMenuCheckboxItem checked className="cursor-pointer">
                    <div className="flex flex-col gap-1 text-left p-2">
                      <div className="font-bold">{t.agentSymbol}</div>
                      <div className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-2 text-xs">
                        <>
                          <div className="">Faction</div>
                          <div className="text-muted-foreground">
                            {t.startingFaction}
                          </div>
                        </>
                        <>
                          <div className="">Headquarters</div>
                          <div className="text-muted-foreground">
                            {t.headquarters}
                          </div>
                        </>
                        <>
                          <div className="">Added</div>
                          <div className="text-muted-foreground">
                            <LocalDateTime datetime={t.addedAt} />
                          </div>
                        </>
                      </div>
                    </div>
                  </DropdownMenuCheckboxItem>
                </button>
              </form>
              <DropdownMenuSeparator />
            </Fragment>
          ))}
          <Link href="/auth">
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-4" />
              Add more Accounts
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
