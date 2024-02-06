'use server'

import { api } from '@/server/api'
import { revalidatePath } from 'next/cache'

export const acceptContract = async (contractId: string) => {
  console.log('hi server', contractId)

  try {
    const result = await api.contracts.acceptContract({
      contractId,
    })

    console.log('acceptContract', result)
    revalidatePath('/game')
  } catch (error: any) {
    throw new Error(await error.response.text())
  }
}
