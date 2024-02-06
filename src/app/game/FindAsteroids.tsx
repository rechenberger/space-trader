import { api } from '@/server/api'

export const FindAsteroids = async ({
  systemSymbol,
}: {
  systemSymbol: string
}) => {
  const waypoints = await api.systems.getSystemWaypoints({
    systemSymbol,
    type: 'ENGINEERED_ASTEROID',
  })

  return (
    <>
      <h2>ASTROIDS</h2>
      <pre>{JSON.stringify(waypoints, null, 2)}</pre>
    </>
  )
}
