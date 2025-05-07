/**
 * Export models from a single place
 */
import { createContext, useContext } from 'react'
import { DEFAULT_ENVIRONMENT } from '../services/environment'
import { RootStore, RootStoreModel } from './root-store'

let _rootStore: RootStore

/**
 * Setup the root store
 * @param rootStore Optional root store to use
 * @returns The root store
 */
export function setupRootStore(rootStore?: RootStore) {
  // Create the root store
  _rootStore = rootStore || RootStoreModel.create({})

  // Set the environment for the stores
  _rootStore.authStore.environment = DEFAULT_ENVIRONMENT
  _rootStore.credentialStore.environment = DEFAULT_ENVIRONMENT

  return _rootStore
}

/**
 * Get the root store singleton
 * @returns The root store
 */
export function getRootStore(): RootStore {
  if (!_rootStore) {
    _rootStore = setupRootStore()
  }

  return _rootStore
}

/**
 * The RootStoreContext provides a way to access
 * the RootStore instance from any component
 */
export const RootStoreContext = createContext<RootStore>({} as RootStore)

/**
 * Provides the root store to any component that needs it
 */
export const RootStoreProvider = RootStoreContext.Provider

/**
 * A hook that screens can use to gain access to our stores
 */
export const useRootStore = () => useContext(RootStoreContext)

// Export models and stores
export * from './root-store'
export * from './auth-store'
export * from './credential-store'
export * from './credential'