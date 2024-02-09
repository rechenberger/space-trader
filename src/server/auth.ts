import { initApi } from '@/server/api'
import { first } from 'lodash-es'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { setSelectedShipSymbol } from './selectedShipSymbol'

export const SavedToken = z.object({
  token: z.string(),
  agentSymbol: z.string(),
  accountId: z.string().optional(),
  startingFaction: z.string(),
  headquarters: z.string(),
  addedAt: z.string(),
})

export type SavedToken = z.infer<typeof SavedToken>

export const getSavedTokens = async () => {
  const allTokensCookie = cookies().get('tokens')
  if (allTokensCookie) {
    return SavedToken.array().parse(JSON.parse(allTokensCookie.value))
  } else {
    return [] as SavedToken[]
  }
}

export const getToken = async () => {
  const token = cookies().get('token')
  return typeof token?.value === 'string' ? token.value : undefined
}

export const getSavedToken = async () => {
  const token = await getToken()
  const allTokens = await getSavedTokens()
  const savedToken = allTokens.find((t) => t.token === token)
  if (!savedToken) {
    throw new Error('No saved token found')
  }
  return savedToken
}

export const login = async ({ token }: { token: string }) => {
  const api = initApi({ token })
  try {
    const { data: agent } = await api.agents.getMyAgent()
    cookies().set('token', token)
    let allTokens = await getSavedTokens()
    if (!allTokens.some((t) => t.token === token)) {
      allTokens.push({
        token,
        agentSymbol: agent.symbol,
        accountId: agent.accountId,
        startingFaction: agent.startingFaction,
        headquarters: agent.headquarters,
        addedAt: new Date().toISOString(),
      })
    }
    cookies().set('tokens', JSON.stringify(allTokens))

    const { data: ships } = await api.fleet.getMyShips()
    await setSelectedShipSymbol({
      selectedShipSymbol: first(ships)?.symbol || '',
    })
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const logout = async () => {
  cookies().delete('token')
}
