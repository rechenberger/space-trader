import {
  AgentsApi,
  ContractsApi,
  DefaultApi,
  FleetApi,
  SystemsApi,
} from '../../packages/spacetraders-sdk/src'

export const initApi = ({ token }: { token?: string }) => {
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
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

  const api = {
    agents: new AgentsApi().withMiddleware(middleware),
    fleet: new FleetApi().withMiddleware(middleware),
    contracts: new ContractsApi().withMiddleware(middleware),
    systems: new SystemsApi().withMiddleware(middleware),
    default: new DefaultApi().withMiddleware(middleware),
  }

  return api
}

// export const api = initApi({ token: process.env.ST_TOKEN! })
