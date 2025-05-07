/**
 * Store for managing authentication state
 */
import { types, flow, Instance, SnapshotOut } from 'mobx-state-tree'
import { withEnvironment } from './extensions/with-environment'
import { withRootStore } from './extensions/with-root-store'
import { AuthMode, AuthResult } from '../services/auth-service'

/**
 * Store to manage authentication state
 */
export const AuthStoreModel = types
  .model('AuthStore')
  .props({
    authenticated: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    offlineMode: types.optional(types.boolean, false),
    error: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    profilePic: types.optional(types.string, ''),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .views(self => ({
    /**
     * Get full user data
     */
    get userData(): any {
      return {
        name: self.name,
        email: self.email,
        profilePic: self.profilePic,
        offlineMode: self.offlineMode,
      }
    },
  }))
  .actions(self => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      self.loading = loading
    },
    
    /**
     * Set error message
     */
    setError(error: string): void {
      self.error = error
    },
    
    /**
     * Set authentication state
     */
    setAuthenticated(authenticated: boolean): void {
      self.authenticated = authenticated
      if (!authenticated) {
        self.name = ''
        self.email = ''
        self.profilePic = ''
      }
    },
    
    /**
     * Set user data
     */
    setUserData(data: { name?: string; email?: string; profilePic?: string }): void {
      if (data.name) self.name = data.name
      if (data.email) self.email = data.email
      if (data.profilePic) self.profilePic = data.profilePic
    },
    
    /**
     * Set offline mode
     */
    setOfflineMode(offline: boolean): void {
      self.offlineMode = offline
      if (offline) {
        self.setAuthenticated(true)
        self.setUserData({
          name: 'Offline User',
          email: '',
          profilePic: '',
        })
      }
    },
    
    /**
     * Initialize auth state
     */
    initAuth: flow(function* () {
      try {
        self.setLoading(true)
        self.setError('')
        
        // Check if we're already authenticated
        const userData = yield self.environment.authService.checkAuth()
        
        if (userData) {
          self.setAuthenticated(true)
          self.setOfflineMode(!!userData.offlineMode)
          self.setUserData({
            name: userData.name || '',
            email: userData.email || '',
            profilePic: userData.profilePic || '',
          })
        } else {
          self.setAuthenticated(false)
        }
        
        self.setLoading(false)
        return true
      } catch (error) {
        console.error('Error initializing auth:', error)
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Login with Google
     */
    loginWithGoogle: flow(function* () {
      try {
        self.setLoading(true)
        self.setError('')
        
        const result: AuthResult = yield self.environment.authService.loginWithGoogle()
        
        if (result.success && result.data) {
          self.setAuthenticated(true)
          self.setOfflineMode(false)
          self.setUserData({
            name: result.data.name || '',
            email: result.data.email || '',
            profilePic: result.data.profilePic || '',
          })
          
          // Load user's credentials
          yield self.rootStore.credentialStore.loadCredentials()
          
          self.setLoading(false)
          return true
        }
        
        self.setError(result.error || 'Login failed')
        self.setAuthenticated(false)
        self.setLoading(false)
        return false
      } catch (error) {
        console.error('Error logging in with Google:', error)
        self.setError('An unexpected error occurred')
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Login with email/password
     */
    loginWithEmailPassword: flow(function* (email: string, password: string) {
      try {
        self.setLoading(true)
        self.setError('')
        
        const result: AuthResult = yield self.environment.authService.loginWithEmailPassword(
          email,
          password
        )
        
        if (result.success && result.data) {
          self.setAuthenticated(true)
          self.setOfflineMode(false)
          self.setUserData({
            name: result.data.name || '',
            email: result.data.email || '',
            profilePic: result.data.profilePic || '',
          })
          
          // Load user's credentials
          yield self.rootStore.credentialStore.loadCredentials()
          
          self.setLoading(false)
          return true
        }
        
        self.setError(result.error || 'Invalid email or password')
        self.setAuthenticated(false)
        self.setLoading(false)
        return false
      } catch (error) {
        console.error('Error logging in with email/password:', error)
        self.setError('An unexpected error occurred')
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Continue in offline mode
     */
    continueOffline: flow(function* () {
      try {
        self.setLoading(true)
        self.setError('')
        
        const result: AuthResult = yield self.environment.authService.continueOffline()
        
        if (result.success) {
          self.setAuthenticated(true)
          self.setOfflineMode(true)
          self.setUserData({
            name: 'Offline User',
            email: '',
            profilePic: '',
          })
          
          // Load local credentials
          yield self.rootStore.credentialStore.loadCredentials()
          
          self.setLoading(false)
          return true
        }
        
        self.setError(result.error || 'Error entering offline mode')
        self.setLoading(false)
        return false
      } catch (error) {
        console.error('Error continuing offline:', error)
        self.setError('An unexpected error occurred')
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Logout
     */
    logout: flow(function* () {
      try {
        self.setLoading(true)
        
        // Call logout service
        yield self.environment.authService.logout()
        
        // Reset auth state
        self.setAuthenticated(false)
        self.setOfflineMode(false)
        
        // Reset credential store
        self.rootStore.credentialStore.reset()
        
        self.setLoading(false)
        return true
      } catch (error) {
        console.error('Error logging out:', error)
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Reset the store to its initial state
     */
    reset(): void {
      self.authenticated = false
      self.loading = false
      self.offlineMode = false
      self.error = ''
      self.name = ''
      self.email = ''
      self.profilePic = ''
    },
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshot extends SnapshotOut<typeof AuthStoreModel> {}