import { Button } from '@/components/ui/button'
import { api } from '@/server/api'
import { Fragment } from 'react'
import { acceptContract } from './contacts.action'

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
                  await acceptContract(contract.id)
                }}
              >
                <Button type="submit">Accept</Button>
              </form>
            </div>
          </Fragment>
        )
      })}
    </>
  )
}
