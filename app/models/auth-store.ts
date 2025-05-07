/**
 * Store for managing authentication state
 */
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { authApi } from "../services/api"
import { loadFromStorage, saveToStorage } from "../utils/storage-helpers"

/**
 * Store to manage authentication state
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    authenticated: types.optional(types.boolean, false),
    offlineMode: types.optional(types.boolean, false),
    userData: types.optional(types.frozen<any>({}), {}),
    loading: types.optional(types.boolean, false),
  })
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
    initialize: flow(function* () {
      self.setLoading(true)
      try {
        // First check if we have stored auth data
        const storedAuth = yield loadFromStorage("auth")
        if (storedAuth && storedAuth.authenticated) {
          self.setAuthenticated(true)
          self.setUserData(storedAuth.userData || {})
          
          // Verify token with API if we're not in offline mode
          if (!self.offlineMode) {
            try {
              const result = yield authApi.verifyToken()
              if (!result.valid) {
                self.setAuthenticated(false)
              }
            } catch (error) {
              console.log("Token verification failed, setting to offline mode", error)
              self.setOfflineMode(true)
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        self.setLoading(false)
      }
    }),

    /**
     * Login with Google
     */
    loginWithGoogle: flow(function* () {
      self.setLoading(true)
      try {
        // Normally we would have Google Auth integration here
        // For demo, we'll simulate a successful login
        const mockSuccessfulLogin = {
          user: {
            name: "John Doe",
            email: "john@example.com",
            profilePic: "https://via.placeholder.com/150"
          },
          token: "mock-token-123456789"
        }
        
        self.setAuthenticated(true)
        self.setUserData(mockSuccessfulLogin.user)
        
        // Save auth state to storage
        yield saveToStorage("auth", {
          authenticated: true,
          userData: self.userData,
          token: mockSuccessfulLogin.token
        })
        
        return true
      } catch (error) {
        console.error("Google login error:", error)
        return false
      } finally {
        self.setLoading(false)
      }
    }),

    /**
     * Logout
     */
    logout: flow(function* () {
      self.setLoading(true)
      try {
        self.setAuthenticated(false)
        self.setUserData({})
        self.setOfflineMode(false)
        
        // Clear auth from storage
        yield saveToStorage("auth", { authenticated: false })
        
        return true
      } catch (error) {
        console.error("Logout error:", error)
        return false
      } finally {
        self.setLoading(false)
      }
    }),

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