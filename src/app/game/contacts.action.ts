'use server'

import { revalidatePath } from 'next/cache'
import { headers } from './page'

export const acceptContract = async (contractId: string) => {
  console.log('hi server', contractId)

  const response = await fetch(
    `https://api.spacetraders.io/v2/my/contracts/${contractId}/accept`,
    {
      method: 'POST',
      headers,
    },
  )

  if (!response.ok) {
    throw new Error(await response.text())
  }

  const result = await response.json()

  console.log('acceptContract', result)
  revalidatePath('/game')
}
