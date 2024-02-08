import { FindMarkets } from './FindMarkets'

export default async function Page({
  params,
}: {
  params: { systemSymbol: string }
}) {
  const systemSymbol = params.systemSymbol

  return (
    <>
      <FindMarkets systemSymbol={systemSymbol} />
    </>
  )
}
