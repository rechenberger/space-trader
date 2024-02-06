import { Button } from '@/components/ui/button'

export default function Page() {
  const register = async () => {
    'use server'
    console.log('hi server')
  }

  return (
    <>
      <h2>Game</h2>
      <form action={register}>
        <Button type="submit">Register</Button>
      </form>
    </>
  )
}
