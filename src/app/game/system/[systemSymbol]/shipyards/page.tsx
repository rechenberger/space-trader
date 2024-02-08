import { FindShipyard } from './FindShipyard'

export default async function Page({
  params,
}: {
  params: { systemSymbol: string }
}) {
  const systemSymbol = params.systemSymbol

  return (
    <>
      <FindShipyard systemSymbol={systemSymbol} />
    </>
  )
}
