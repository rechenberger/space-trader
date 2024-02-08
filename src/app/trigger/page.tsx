import { client } from '@/trigger'

export default async function Page() {
  const jobs = await client.getRuns('extractor-job', {
    take: 10,
  })

  const job = await client.getRun(jobs.runs[0].id)

  return (
    <>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
      <hr />
      <pre>{JSON.stringify(job, null, 2)}</pre>
    </>
  )
}
