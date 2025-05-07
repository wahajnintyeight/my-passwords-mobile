/**
 * Store for managing authentication state
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { authService } from "../services/auth-service"
import { withEnvironment } from "./extensions/with-environment"
import { withRootStore } from "./extensions/with-root-store"

/**
 * Store to manage authentication state
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    authenticated: types.optional(types.boolean, false),
    offlineMode: types.optional(types.boolean, false),
    userData: types.optional(
      types.model({
        name: types.maybe(types.string),
        email: types.maybe(types.string),
        profilePic: types.maybe(types.string),
      }),
      {},
    ),
    loading: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .views((self) => ({
    /**
     * Get full user data
     */
    get userData(): any {
      return self.userData
    },
  }))
  .actions((self) => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      self.loading = loading
    },

    /**
     * Set authentication state
     */
    setAuthenticated(authenticated: boolean): void {
      self.authenticated = authenticated
    },

    /**
     * Set offline mode
     */
    setOfflineMode(offline: boolean): void {
      self.offlineMode = offline
    },

    /**
     * Set user data
     */
    setUserData(data: { name?: string; email?: string; profilePic?: string }): void {
      self.userData = { ...self.userData, ...data }
    },

    /**
     * Initialize auth state
     */
    async initialize(): Promise<void> {
      self.setLoading(true)
      try {
        const isAuthenticated = await authService.isAuthenticated()
        self.setAuthenticated(isAuthenticated)
        
        if (isAuthenticated) {
          const userData = await authService.getUserProfile()
          if (userData) {
            self.setUserData(userData)
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error)
        self.setAuthenticated(false)
        self.setOfflineMode(true)
      } finally {
        self.setLoading(false)
      }
    },

    /**
     * Login with Google
     */
    async loginWithGoogle(): Promise<boolean> {
      self.setLoading(true)
      try {
        const result = await authService.signInWithGoogle()
        if (result.success) {
          self.setAuthenticated(true)
          self.setUserData(result.user)
          return true
        }
        return false
      } catch (error) {
        console.error("Google login failed:", error)
        return false
      } finally {
        self.setLoading(false)
      }
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
      self.setLoading(true)
      try {
        await authService.signOut()
        self.setAuthenticated(false)
        self.setUserData({})
        // Clear credentials when logging out
        self.rootStore.credentialStore.clearAllCredentials()
      } catch (error) {
        console.error("Logout failed:", error)
      } finally {
        self.setLoading(false)
      }
    },

    /**
     * Reset the store to its initial state
     */
    reset(): void {
      self.authenticated = false
      self.offlineMode = false
      self.userData = {}
      self.loading = false
    },
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshot extends SnapshotOut<typeof AuthStoreModel> {}