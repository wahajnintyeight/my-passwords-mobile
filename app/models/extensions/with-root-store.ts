/**
 * Extension to add root store reference to a model
 */
import { getRoot, IStateTreeNode } from "mobx-state-tree"
import { RootStore } from "../root-store"

/**
 * Adds a rootStore property to the node's context.
 */
export const withRootStore = (self: IStateTreeNode) => {
  return {
    views: {
      /**
       * Get the root store.
       */
      get rootStore() {
        return getRoot<RootStore>(self)
      }
    }
  }
}
