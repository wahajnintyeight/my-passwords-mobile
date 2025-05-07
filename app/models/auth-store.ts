/**
 * Store for managing authentication state
 */
import { types, flow, Instance, SnapshotOut } from 'mobx-state-tree'
import * as authService from '../services/auth-service'
import * as api from '../services/api'
import { withEnvironment } from './extensions/with-environment'
import { saveToStorage, loadFromStorage } from '../utils/storage-helpers'
import Config from '../config'

// Storage keys
const AUTH_STATE_KEY = `${Config.storage.prefix}auth_state`
const USER_DATA_KEY = `${Config.storage.prefix}user_data`

/**
 * Store to manage authentication state
 */
export const AuthStoreModel = types
  .model('AuthStore')
  .props({
    authenticated: types.optional(types.boolean, false),
    offlineMode: types.optional(types.boolean, false),
    userData: types.optional(
      types.model({
        name: types.optional(types.string, ''),
        email: types.optional(types.string, ''),
        profilePic: types.optional(types.string, '')
      }),
      {}
    ),
    loading: types.optional(types.boolean, false)
  })
  .extend(withEnvironment)
  .views(self => ({
    /**
     * Get full user data
     */
    get userData(): any {
      return {
        name: self.userData.name,
        email: self.userData.email,
        profilePic: self.userData.profilePic
      }
    }
  }))
  .actions(self => ({
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
      saveToStorage(AUTH_STATE_KEY, { authenticated })
    },
    
    /**
     * Set offline mode
     */
    setOfflineMode(offline: boolean): void {
      self.offlineMode = offline
      saveToStorage(AUTH_STATE_KEY, { 
        authenticated: self.authenticated,
        offlineMode: offline
      })
    },
    
    /**
     * Set user data
     */
    setUserData(data: { name?: string; email?: string; profilePic?: string }): void {
      self.userData.name = data.name || self.userData.name
      self.userData.email = data.email || self.userData.email
      self.userData.profilePic = data.profilePic || self.userData.profilePic
      
      // Save to storage
      saveToStorage(USER_DATA_KEY, self.userData)
    }
  }))
  .actions(self => ({
    /**
     * Initialize auth state
     */
    initializeAuth: flow(function* () {
      self.setLoading(true)
      
      try {
        // Load auth state from storage
        const storedAuthState = yield loadFromStorage(AUTH_STATE_KEY)
        const storedUserData = yield loadFromStorage(USER_DATA_KEY)
        
        if (storedAuthState) {
          self.setAuthenticated(storedAuthState.authenticated || false)
          self.setOfflineMode(storedAuthState.offlineMode || false)
        }
        
        if (storedUserData) {
          self.setUserData(storedUserData)
        }
        
        // If authenticated, verify with server
        if (self.authenticated && !self.offlineMode) {
          const authResult = yield authService.initializeAuth()
          
          if (authResult.success) {
            self.setAuthenticated(true)
            self.setUserData(authResult.userData || {})
            return { success: true }
          } else {
            // Failed to authenticate with server
            self.setAuthenticated(false)
            return { 
              success: false, 
              error: authResult.error || 'Failed to authenticate with server' 
            }
          }
        }
        
        return { success: true }
      } catch (error) {
        console.error('Error initializing auth:', error)
        return { 
          success: false, 
          error: 'Failed to initialize authentication' 
        }
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
        const result = yield authService.loginWithGoogle()
        
        if (result.success) {
          self.setAuthenticated(true)
          self.setUserData(result.userData || {})
          self.setOfflineMode(false)
          return { success: true }
        } else {
          return { 
            success: false, 
            error: result.error || 'Failed to login with Google' 
          }
        }
      } catch (error) {
        console.error('Error logging in with Google:', error)
        return { 
          success: false, 
          error: 'Login failed' 
        }
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Login with email/password
     */
    loginWithEmailPassword: flow(function* (email: string, password: string) {
      self.setLoading(true)
      
      try {
        const result = yield authService.loginWithEmailPassword(email, password)
        
        if (result.success) {
          self.setAuthenticated(true)
          self.setUserData(result.userData || {})
          self.setOfflineMode(false)
          return { success: true }
        } else {
          return { 
            success: false, 
            error: result.error || 'Failed to login with email/password' 
          }
        }
      } catch (error) {
        console.error('Error logging in with email/password:', error)
        return { 
          success: false, 
          error: 'Login failed' 
        }
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Continue in offline mode
     */
    useOfflineMode: flow(function* () {
      self.setLoading(true)
      
      try {
        self.setAuthenticated(false)
        self.setOfflineMode(true)
        self.setUserData({
          name: 'Offline User',
          email: '',
          profilePic: ''
        })
        
        return { success: true }
      } catch (error) {
        console.error('Error setting offline mode:', error)
        return { 
          success: false, 
          error: 'Failed to set offline mode' 
        }
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
        // Clear session with API if we're authenticated
        if (self.authenticated) {
          yield authService.logout()
        }
        
        // Reset store state
        self.setAuthenticated(false)
        self.setUserData({
          name: '',
          email: '',
          profilePic: ''
        })
        self.setOfflineMode(false)
        
        // Clear API session
        yield api.clearSession()
        
        return { success: true }
      } catch (error) {
        console.error('Error logging out:', error)
        return { 
          success: false,
          error: 'Logout failed' 
        }
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
      self.userData.name = ''
      self.userData.email = ''
      self.userData.profilePic = ''
      self.loading = false
    }
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshot extends SnapshotOut<typeof AuthStoreModel> {}