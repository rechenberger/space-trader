import { LocalDateTime } from '@/components/demo/LocalDateTime'
import { cn } from '@/lib/utils'
import { SavedToken } from '@/server/auth'
import { SecretInput } from '../game/account/SecretInput'

export const SavedTokenDetails = ({
  t,
  className,
  showAccountId,
  showToken,
}: {
  t: SavedToken
  className?: string
  showAccountId?: boolean
  showToken?: boolean
}) => {
  return (
    <>
      <div className={cn('grid grid-cols-[auto_1fr] gap-2', className)}>
        <>
          <div className="">Faction</div>
          <div className="text-muted-foreground">{t.startingFaction}</div>
        </>
        <>
          <div className="">Headquarters</div>
          <div className="text-muted-foreground">{t.headquarters}</div>
        </>
        <>
          <div className="">Added</div>
          <div className="text-muted-foreground">
            <LocalDateTime datetime={t.addedAt} />
          </div>
        </>
        {showAccountId && (
          <>
            <div className="">Account Id</div>
            <div className="text-muted-foreground">
              {t.accountId || 'No Account Id'}
            </div>
          </>
        )}
        {showToken && (
          <>
            <div className="">Token</div>
            <div className="text-muted-foreground">
              <SecretInput value={t.token} readOnly />
            </div>
          </>
        )}
      </div>
    </>
  )
}
