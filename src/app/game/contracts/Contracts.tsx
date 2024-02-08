import { LocalDateTime } from '@/components/demo/LocalDateTime'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/formatNumber'
import { api } from '@/server/api'
import { capitalCase } from 'change-case'
import { revalidatePath } from 'next/cache'
import { Fragment } from 'react'

export const Contracts = async () => {
  const myContracts = await api.contracts.getContracts()

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {myContracts.data.map((contract) => {
          return (
            <Fragment key={contract.id}>
              <Card className="flex flex-col gap-2 text-sm p-4">
                <div className="flex flex-row justify-between">
                  <strong>{capitalCase(contract.type)}</strong>
                  <div className="text-muted-foreground">
                    {capitalCase(contract.factionSymbol)}
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <>
                    <div className="">Status</div>
                    <div className="text-muted-foreground">
                      {contract.fulfilled
                        ? 'Fulfilled'
                        : contract.accepted
                          ? 'Accepted'
                          : 'Pending'}
                    </div>
                  </>
                  <>
                    <div className="">Payment (Accept)</div>
                    <div className="text-muted-foreground">
                      {formatNumber(contract.terms.payment.onAccepted)} Credits
                    </div>
                  </>
                  <>
                    <div className="">Payment (Fulfill)</div>
                    <div className="text-muted-foreground">
                      {formatNumber(contract.terms.payment.onFulfilled)} Credits
                    </div>
                  </>
                  {!!contract.deadlineToAccept && (
                    <>
                      <div className="">Deadline to Accept</div>
                      <div className="text-muted-foreground">
                        <LocalDateTime
                          datetime={contract.deadlineToAccept?.toISOString()}
                        />
                      </div>
                    </>
                  )}
                  {contract.terms.deliver?.map((d, idx) => (
                    <Fragment key={idx}>
                      <div className="">Deliver #{idx + 1}</div>
                      <div className="text-muted-foreground">
                        <div>
                          {d.unitsFulfilled}/{d.unitsRequired}{' '}
                          {capitalCase(d.tradeSymbol)}
                        </div>
                        <div>@ {d.destinationSymbol}</div>
                      </div>
                    </Fragment>
                  ))}
                  <>
                    <div className="">Deadline to Deliver</div>
                    <div className="text-muted-foreground">
                      <LocalDateTime
                        datetime={contract.terms.deadline.toISOString()}
                      />
                    </div>
                  </>
                </div>
                <div className="flex flex-row justify-end">
                  {!contract.accepted && (
                    <form
                      action={async () => {
                        'use server'
                        const result = await api.contracts.acceptContract({
                          contractId: contract.id,
                        })

                        console.log('acceptContract', result)
                        revalidatePath('/game')
                      }}
                    >
                      <Button type="submit" disabled={contract.accepted}>
                        Accept
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
