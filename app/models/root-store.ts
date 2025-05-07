/**
 * Root store that combines all other stores
 */
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { AuthStoreModel } from './auth-store'
import { CredentialStoreModel } from './credential-store'

/**
 * The RootStore instance
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    authStore: types.optional(AuthStoreModel, {}),
    credentialStore: types.optional(CredentialStoreModel, {}),
  })
  .actions(self => ({
    /**
     * Reset the root store
     */
    reset() {
      self.authStore.reset()
      self.credentialStore.reset()
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}