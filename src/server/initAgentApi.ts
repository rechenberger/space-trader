import { initApi } from './api'
import { getToken } from './auth'

export const initAgentApi = async () => {
  const token = await getToken()
  if (!token) {
    throw new Error('UNAUTHORIZED')
  }
  return initApi({ token })
}
