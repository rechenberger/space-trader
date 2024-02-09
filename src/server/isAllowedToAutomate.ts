import { getToken } from './auth'

export const isAllowedToAutomate = async () => {
  const token = await getToken()
  if (!token) return false
  if (!process.env.ST_TOKEN) return false
  return token === process.env.ST_TOKEN
}

export const isAllowedToAutomateOrThrow = async () => {
  const isAllowed = await isAllowedToAutomate()
  if (!isAllowed) {
    throw new Error('UNAUTHORIZED')
  }
}
