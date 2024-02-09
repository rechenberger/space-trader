import { initApi } from '@/server/api'
import { cookies } from 'next/headers'
import { z } from 'zod'

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
  } catch (error) {
    throw new Error('Invalid token')
  }
}
