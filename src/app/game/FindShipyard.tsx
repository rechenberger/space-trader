import { headers } from './page'

export const FindShipyard = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
  const result = (
    await fetch(
      `https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints?traits=SHIPYARD`,
      {
        headers,
      },
    ).then((res) => res.json())
  ).data
  return (
    <>
      <h2>Shipyards</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  )
}
