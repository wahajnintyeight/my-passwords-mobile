/**
 * Extension to add environment to a model
 */
import { getEnv, IStateTreeNode } from "mobx-state-tree"
import { Environment } from "../../services/environment"

/**
 * Adds a environment property to the node's context.
 */
export const withEnvironment = (self: IStateTreeNode) => {
  return {
    views: {
      /**
       * Get the environment.
       */
      get environment() {
        return getEnv<Environment>(self)
      }
    }
  }
}
