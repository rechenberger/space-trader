import { getToken } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const token = await getToken()
  if (token) {
    redirect('/game')
  } else {
    redirect('/auth')
  }
}
