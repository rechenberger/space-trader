import {
  AgentsApi,
  ContractsApi,
  FleetApi,
  SystemsApi,
} from '../../packages/spacetraders-sdk/src'

export const headers = {
  Authorization: `Bearer ${process.env.ST_TOKEN}`,
  'Content-Type': 'application/json',
}
const middleware = {
  pre: async (context: any) => {
    return {
      ...context,
      init: {
        ...context.init,
        headers,
      },
    }
  },
}

export const api = {
  agents: new AgentsApi().withMiddleware(middleware),
  fleet: new FleetApi().withMiddleware(middleware),
  contracts: new ContractsApi().withMiddleware(middleware),
  systems: new SystemsApi().withMiddleware(middleware),
}
