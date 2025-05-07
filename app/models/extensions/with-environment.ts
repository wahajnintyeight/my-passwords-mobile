/**
 * Extension for accessing environment in MST models
 */
import { IStateTreeNode } from "mobx-state-tree"
import { Environment } from "../../services/environment"

/**
 * Props for environment extension
 */
export interface WithEnvironmentProps {
  /**
   * The environment.
   */
  environment: Environment
}

/**
 * Adds an environment property to the node for accessing various environment services.
 */
export const withEnvironment = (self: IStateTreeNode) => ({
  views: {
    /**
     * The environment.
     */
    get environment() {
      return getEnvironment(self)
    }
  }
})

/**
 * Get the environment from the root node.
 */
export function getEnvironment(self: any): Environment {
  return self.__getEnv ? self.__getEnv() : ({} as Environment)
}