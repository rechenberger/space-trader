import { Button } from '@/components/ui/button'

export const Register = () => {
  const register = async () => {
    'use server'
    console.log('hi server')

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: 'TINGO',
        faction: 'COSMIC',
      }),
    }

    const response = await fetch(
      'https://api.spacetraders.io/v2/register',
      options,
    )
    const result = await response.json()

    console.log(result)
  }
  return (
    <>
      <form action={register}>
        <Button type="submit">Register</Button>
      </form>
    </>
  )
}
