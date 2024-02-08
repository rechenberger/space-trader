import { IO, RunTaskOptions } from '@trigger.dev/sdk'
import superjson from 'superjson'

type ServerTask = Parameters<Parameters<IO['runTask']>[1]>[0]

export const runTaskSuperjson = async <T>(
  io: IO,
  cacheKey: string,
  callback: (task: ServerTask, io: IO) => Promise<T>,
  options?: RunTaskOptions,
) => {
  const encodedResponse = await io.runTask(
    cacheKey,
    async (task, io) => {
      const response = await callback(task, io)
      const encoded = superjson.stringify(response)
      return encoded
    },
    options,
  )
  const response = superjson.parse<T>(encodedResponse)
  return response
}
