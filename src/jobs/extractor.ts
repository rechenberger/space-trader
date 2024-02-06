import { client } from '@/trigger'
import { eventTrigger } from '@trigger.dev/sdk'

client.defineJob({
  id: 'extractor-job',
  name: 'Extractor Job',
  version: '0.0.1',
  trigger: eventTrigger({
    name: 'extractor.event',
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info(`Starting the extractor job`)
  },
})
