/**
 * Extension to add root store access to models
 */
import { IAnyStateTreeNode, IStateTreeNode, types } from "mobx-state-tree"
import { RootStore } from "../root-store"

/**
 * Adds a rootStore property to the model.
 */
export const withRootStore = types
  .model("withRootStore")
  .volatile(() => ({
    rootStore: undefined as unknown as RootStore,
  }))
  .actions((self) => ({
    /**
     * Set the rootStore to allow the model to access other stores and services
     * 
     * @param value The root store
     */
    setRootStore(value: IStateTreeNode) {
      self.rootStore = value as unknown as RootStore
    },
  }))