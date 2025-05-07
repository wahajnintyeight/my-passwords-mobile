/**
 * Store for managing authentication state
 */
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { withEnvironment } from "./extensions/with-environment"
import { authService } from "../services/auth-service"
import { storage } from "../services/storage-service"

const USER_DATA_KEY = "user_data"
const OFFLINE_MODE_KEY = "offline_mode"

/**
 * Store to manage authentication state
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    isAuthenticated: types.optional(types.boolean, false),
    isOfflineMode: types.optional(types.boolean, false),
    userName: types.maybe(types.string),
    userEmail: types.maybe(types.string),
    userProfilePic: types.maybe(types.string),
    isLoading: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .views(self => ({
    /**
     * Get full user data
     */
    get userData(): any {
      return {
        name: self.userName,
        email: self.userEmail,
        profilePic: self.userProfilePic,
      }
    }
  }))
  .actions(self => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      self.isLoading = loading
    },
    
    /**
     * Set authentication state
     */
    setAuthenticated(authenticated: boolean): void {
      self.isAuthenticated = authenticated
    },
    
    /**
     * Set offline mode
     */
    setOfflineMode(offline: boolean): void {
      self.isOfflineMode = offline
      storage.save(OFFLINE_MODE_KEY, offline.toString())
    },
    
    /**
     * Set user data
     */
    setUserData(data: { name?: string; email?: string; profilePic?: string }): void {
      if (data.name) self.userName = data.name
      if (data.email) self.userEmail = data.email
      if (data.profilePic) self.userProfilePic = data.profilePic
      
      // Save to storage
      storage.saveObject(USER_DATA_KEY, {
        name: self.userName,
        email: self.userEmail,
        profilePic: self.userProfilePic,
      })
    },
    
    /**
     * Initialize auth state
     */
    initialize: flow(function* () {
      self.setLoading(true)
      try {
        // Check if in offline mode
        const offlineMode = yield storage.load(OFFLINE_MODE_KEY)
        if (offlineMode === "true") {
          self.isOfflineMode = true
          
          // Load saved user data if available
          const userData = yield storage.loadObject(USER_DATA_KEY)
          if (userData) {
            self.setUserData(userData)
          }
          
          return { success: true, offlineMode: true }
        }
        
        // Check if authenticated
        const isAuth = yield authService.isAuthenticated()
        self.setAuthenticated(isAuth)
        
        if (isAuth) {
          // Load user profile
          const profile = yield authService.getUserProfile()
          if (profile) {
            self.setUserData({
              name: profile.name,
              email: profile.email,
              profilePic: profile.picture,
            })
          }
        }
        
        return { success: true, isAuthenticated: isAuth }
      } catch (error) {
        console.error("Auth initialization error:", error)
        // Fall back to offline mode on error
        self.setOfflineMode(true)
        return { success: false, error }
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
        // Perform Google auth
        const result = yield authService.signInWithGoogle()
        
        // Update state
        self.setAuthenticated(true)
        self.setOfflineMode(false)
        
        // Set user data
        self.setUserData({
          name: result.user.name,
          email: result.user.email,
          profilePic: result.user.picture,
        })
        
        return { success: true }
      } catch (error) {
        console.error("Google login error:", error)
        return { success: false, error }
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
        yield authService.signOut()
        
        // Update state but keep user data for offline
        self.setAuthenticated(false)
        self.setOfflineMode(true)
        
        return { success: true }
      } catch (error) {
        console.error("Logout error:", error)
        return { success: false, error }
      } finally {
        self.setLoading(false)
      }
    })
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshot extends SnapshotOut<typeof AuthStoreModel> {}
