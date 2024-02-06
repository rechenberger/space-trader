import { api } from '@/server/api'

export default async function Page() {
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
