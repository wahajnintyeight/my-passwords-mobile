/**
 * Extension for accessing the root store in MST models
 */
import { IStateTreeNode } from "mobx-state-tree"
import { RootStore } from "../root-store"

/**
 * Props for root store extension
 */
export interface WithRootStoreProps {
  /**
   * The root store.
   */
  rootStore: RootStore
}

/**
 * Adds a rootStore property to the node for accessing other stores/models in the tree.
 */
export const withRootStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The root store.
     */
    get rootStore() {
      return getRootStore(self)
    }
  }
})

/**
 * Gets the root store from the node's environment.
 */
export function getRootStore(self: any): RootStore {
  return self.__getEnv ? self.__getEnv().rootStore : ({} as RootStore)
}