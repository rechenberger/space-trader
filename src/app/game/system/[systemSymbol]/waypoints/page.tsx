import { FindWaypoints } from './FindWaypoints'

export default async function Page({
  params,
}: {
  params: { systemSymbol: string }
}) {
  const systemSymbol = params.systemSymbol

  return (
    <>
      <FindWaypoints systemSymbol={systemSymbol} />
    </>
  )
}
