/**
 * Root store extension for mobx-state-tree models
 */
import { IStateTreeNode, types } from "mobx-state-tree"
import { RootStore } from "../root-store"

/**
 * Model extension to include root store as a property
 */
export const withRootStore = types.model({}).volatile(self => ({
  /**
   * Root store reference
   */
  rootStore: null as unknown as RootStore,
})).actions(self => ({
  /**
   * Set the root store
   */
  setRootStore(value: IStateTreeNode) {
    (self as any).rootStore = value
  },
}))