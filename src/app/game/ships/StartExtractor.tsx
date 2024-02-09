import { Button } from '@/components/ui/button'
import { isAllowedToAutomateOrThrow } from '@/server/isAllowedToAutomate'
import { client } from '@/trigger'

export const StartExtractor = () => {
  return (
    <>
      <form
        action={async () => {
          'use server'
          await isAllowedToAutomateOrThrow()
          client.sendEvent({
            name: 'extractor.event',
            payload: {},
          })
        }}
      >
        <Button type="submit" variant={'default'} size="sm">
          Start Extractor
        </Button>
      </form>
    </>
  )
}
