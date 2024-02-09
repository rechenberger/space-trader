import { initAgentApi } from '@/server/initAgentApi'

export default async function Page() {
  const api = await initAgentApi()
  const agents = await api.agents.getMyAgent({})
  return (
    <>
      Dev
      <pre>
        <code>{JSON.stringify(agents, null, 2)}</code>
      </pre>
    </>
  )
}
