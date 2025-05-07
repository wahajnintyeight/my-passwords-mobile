/**
 * Adds the environment property to models
 */
import { types } from 'mobx-state-tree'
import { Environment } from '../../services/environment'

/**
 * Adds the environment property to models
 */
export const withEnvironment = types
  .model('withEnvironment')
  .props({
    environment: types.optional(types.frozen<Environment>(), {}),
  })
  .actions(self => ({
    setEnvironment(value: Environment) {
      self.environment = value
    },
  }))