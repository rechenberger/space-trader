import { Button } from '@/components/ui/button'
import { client } from '@/trigger'

export const StartExtractor = () => {
  return (
    <>
      <form
        action={async () => {
          'use server'
          client.sendEvent({
            name: 'extractor.event',
            payload: {},
          })
        }}
      >
        <Button type="submit">Start Extractor</Button>
      </form>
    </>
  )
}
