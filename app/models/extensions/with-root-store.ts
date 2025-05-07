/**
 * Add access to the root store to any model
 */
import { getRoot, types } from 'mobx-state-tree'
import { RootStore } from '../root-store'

/**
 * Adds a rootStore property to the model that uses getRoot() to provide access
 * to the entire root hierarchy.
 */
export const withRootStore = types.model('withRootStore').views(self => ({
  /**
   * Get the root store
   */
  get rootStore(): RootStore {
    return getRoot(self) as RootStore
  },
  
  /**
   * Get the auth store from the root store
   */
  get authStore() {
    return this.rootStore.authStore
  },
  
  /**
   * Get the credential store from the root store
   */
  get credentialStore() {
    return this.rootStore.credentialStore
  },
}))