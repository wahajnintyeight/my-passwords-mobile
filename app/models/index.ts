import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RootStoreModel } from "./root-store"

// The RootStore instance
export interface RootStore extends Instance<typeof RootStoreModel> {}

// The data of the RootStore
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

// Export all models and stores
export * from "./root-store"
export * from "./auth-store"
export * from "./credential-store"
export * from "./credential"
export * from "./extensions/with-environment"
export * from "./extensions/with-root-store"
export * from "./helpers/use-initial-root-store"

// Setup the root store
let _rootStore: RootStore

export function setupRootStore(rootStore?: RootStore) {
  // Save the root store as needed
  if (_rootStore !== rootStore) {
    _rootStore = rootStore as RootStore
  }
  return _rootStore
}

// Get the root store (only used for tests)
export function getRootStore(): RootStore {
  return _rootStore
}

// Provider for the RootStore context
import { createContext, useContext } from "react"
export const RootStoreContext = createContext<RootStore>({} as RootStore)
export const RootStoreProvider = RootStoreContext.Provider
export const useRootStore = () => useContext(RootStoreContext)