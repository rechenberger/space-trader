export const headers = {
  Authorization: `Bearer ${process.env.ST_TOKEN}`,
  'Content-Type': 'application/json',
}

import { AgentsApi } from '../../../packages/spacetraders-sdk/src'

const api = new AgentsApi().withMiddleware({
  pre: async (context) => {
    return {
      ...context,
      init: {
        ...context.init,
        headers,
      },
    }
  },
})

export default async function Page() {
  const agents = await api.getMyAgent({})
  return (
    <>
      Dev
      <pre>
        <code>{JSON.stringify(agents, null, 2)}</code>
      </pre>
    </>
  )
}
