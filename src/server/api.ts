import {
  AgentsApi,
  ContractsApi,
  FleetApi,
  SystemsApi,
  BaseAPI,
} from '../../packages/spacetraders-sdk/src'

export const api = {
  agents: new AgentsApi(),
  fleet: new FleetApi(),
  contracts: new ContractsApi(),
  systems: new SystemsApi(),
}
