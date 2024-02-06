import { api } from '@/server/api'

export const MyShips = async () => {
  const ships = (await api.fleet.getMyShips()).data
  return (
    <>
      {ships.map((ship, idx) => (
        <div key={idx} className="border p-2">
          <h3>{ship.symbol}</h3>
          <pre>
            {JSON.stringify(
              {
                role: ship.registration.role,
                modules: ship.modules.map((m) => m.name).join(', '),
                fuel: ship.fuel.current,
                cargo: ship.cargo,
                crew: ship.crew.current,
                navStatus: ship.nav.status,
              },
              null,
              2,
            )}
          </pre>
        </div>
      ))}
    </>
  )
}
