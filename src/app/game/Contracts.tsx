import { Button } from '@/components/ui/button'
import { Fragment } from 'react'
import { acceptContract } from './contacts.action'
import { headers } from './page'

export const Contracts = async () => {
  const myContracts = await fetch(
    `https://api.spacetraders.io/v2/my/contracts`,
    {
      headers,
    },
  ).then((res) => res.json())

  return (
    <>
      {myContracts.data.map((contract: any) => {
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
