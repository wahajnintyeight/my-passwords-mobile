/**
 * Environment extension for mobx-state-tree models
 */
import { Environment } from "../../services/environment"
import { getSnapshot, IStateTreeNode, types } from "mobx-state-tree"

/**
 * Model extension to include environment properties
 */
export const withEnvironment = types.model({}).extend(self => {
  // Create a new Environment instance
  let environment = new Environment()

  return {
    views: {
      /**
       * Get environment
       */
      get environment() {
        return environment
      },
    },
    actions: {
      /**
       * Set the environment
       */
      setEnvironment(value: Environment) {
        environment = value
      },
    },
  }
})

/**
 * Helper function to create a new Environment instance
 */
export const createEnvironment = () => new Environment()