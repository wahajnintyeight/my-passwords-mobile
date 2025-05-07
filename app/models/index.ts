import { createContext, useContext } from "react"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RootStoreModel } from "./root-store"
import DEFAULT_ENVIRONMENT from "../services/environment"

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

let _rootStore: RootStore

/**
 * Setup the root store
 * @param rootStore Optional root store to use
 * @returns The root store
 */
export function setupRootStore(rootStore?: RootStore) {
  // If there is a root store provided, use it
  if (rootStore) {
    _rootStore = rootStore
    return _rootStore
  }

  // If there is already a root store, use it
  if (_rootStore) return _rootStore

  // Otherwise create a new one
  _rootStore = RootStoreModel.create(
    {},
    {
      rootStore: {} as any,
      environment: DEFAULT_ENVIRONMENT
    }
  )

  // Track changes & save to AsyncStorage when appropriate
  // onSnapshot(_rootStore, snapshot => console.log("Snapshot: ", snapshot))

  return _rootStore
}

/**
 * Get the root store singleton
 * @returns The root store
 */
export function getRootStore(): RootStore {
  return _rootStore
}

// Create a React Context with the RootStore instance.
export const RootStoreContext = createContext<RootStore>({} as RootStore)
export const RootStoreProvider = RootStoreContext.Provider
export const useRootStore = () => useContext(RootStoreContext)