import { FindAsteroids } from './FindAsteroids'

export default async function Page({
  params,
}: {
  params: { systemSymbol: string }
}) {
  const systemSymbol = params.systemSymbol

  return (
    <>
      <FindAsteroids systemSymbol={systemSymbol} />
    </>
  )
}
