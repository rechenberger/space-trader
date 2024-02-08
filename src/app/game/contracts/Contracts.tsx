import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'
import { Fragment } from 'react'

export const Contracts = async () => {
  const myContracts = await api.contracts.getContracts()

  return (
    <>
      {myContracts.data.map((contract) => {
        return (
          <Fragment key={contract.id}>
            <div className="flex flex-row gap-4">
              <pre>{JSON.stringify(contract, null, 2)}</pre>

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
            </div>
          </Fragment>
        )
      })}
    </>
  )
}
