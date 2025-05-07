/**
 * Root store that combines all other stores
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CredentialStoreModel } from "./credential-store"
import { AuthStoreModel } from "./auth-store"

/**
 * The RootStore instance
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    credentialStore: types.optional(CredentialStoreModel, {}),
    authStore: types.optional(AuthStoreModel, {}),
  })
  .actions(self => ({
    /**
     * Reset the root store
     */
    reset() {
      // This will reset the stores to their defaults
      const credentialStore = CredentialStoreModel.create({})
      const authStore = AuthStoreModel.create({})
      
      self.credentialStore = credentialStore
      self.authStore = authStore
    }
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
