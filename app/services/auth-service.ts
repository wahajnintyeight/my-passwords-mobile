/**
 * Auth service for managing authentication
 */
import * as AuthSession from 'expo-auth-session'
import * as Crypto from 'expo-crypto'
import { loadFromStorage, saveToStorage } from '../utils/storage-helpers'
import { api } from './api'
import Config from '../config'

/**
 * Storage keys
 */
const AUTH_USER_KEY = 'secureVault_authUser'
const AUTH_MODE_KEY = 'secureVault_authMode'

/**
 * Auth modes
 */
export enum AuthMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

/**
 * Google auth config
 */
const GOOGLE_AUTH_CONFIG = {
  clientId: '593634276220-5k1a8c0j7p1mt6dji8hamc7pl72e8b4h.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  redirectUri: AuthSession.makeRedirectUri({
    useProxy: true,
  }),
}

/**
 * Auth result interface
 */
export interface AuthResult {
  success: boolean
  data?: any
  error?: string
}

/**
 * Auth service for managing authentication
 */
class AuthService {
  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<any> {
    try {
      // Check if we have auth data stored
      const authMode = await loadFromStorage(AUTH_MODE_KEY) as AuthMode
      
      if (authMode === AuthMode.OFFLINE) {
        // Offline mode, load user from storage
        return {
          name: 'Offline User',
          email: '',
          offlineMode: true,
        }
      } else if (authMode === AuthMode.ONLINE) {
        // Online mode, load user from storage
        const userData = await loadFromStorage(AUTH_USER_KEY)
        
        if (userData) {
          // Validate session
          const sessionValid = await api.ensureSession()
          
          if (sessionValid) {
            return {
              ...userData,
              offlineMode: false,
            }
          }
        }
      }
      
      // No valid auth found
      return null
    } catch (error) {
      console.error('Error checking auth:', error)
      return null
    }
  }
  
  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<AuthResult> {
    try {
      // Create the auth request
      const authRequest = new AuthSession.AuthRequest({
        clientId: GOOGLE_AUTH_CONFIG.clientId,
        scopes: GOOGLE_AUTH_CONFIG.scopes,
        redirectUri: GOOGLE_AUTH_CONFIG.redirectUri,
      })
      
      // Start the auth flow
      const result = await authRequest.promptAsync({
        useProxy: true,
      })
      
      // Check if the user cancelled the flow
      if (result.type === 'cancel' || result.type === 'dismiss') {
        return {
          success: false,
          error: 'Login cancelled',
        }
      }
      
      // Check if we got an authentication error
      if (result.type !== 'success' || !result.authentication) {
        return {
          success: false,
          error: 'Authentication failed',
        }
      }
      
      // Authenticate with the API
      const apiResult = await api.loginWithGoogle(result.authentication.accessToken)
      
      if (apiResult.ok && apiResult.data) {
        // Save the user data
        const userData = {
          name: apiResult.data.name || '',
          email: apiResult.data.email || '',
          profilePic: apiResult.data.profilePic || '',
        }
        
        await saveToStorage(AUTH_USER_KEY, userData)
        await saveToStorage(AUTH_MODE_KEY, AuthMode.ONLINE)
        
        return {
          success: true,
          data: userData,
        }
      }
      
      return {
        success: false,
        error: apiResult.data?.message || 'Login failed',
      }
    } catch (error) {
      console.error('Error during Google login:', error)
      return {
        success: false,
        error: 'An error occurred during login',
      }
    }
  }
  
  /**
   * Login with email and password
   */
  async loginWithEmailPassword(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required',
        }
      }
      
      // Hash the password for better security
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      )
      
      // Authenticate with the API
      const apiResult = await api.login(email, hashedPassword)
      
      if (apiResult.ok && apiResult.data) {
        // Save the user data
        const userData = {
          name: apiResult.data.name || '',
          email: apiResult.data.email || '',
          profilePic: apiResult.data.profilePic || '',
        }
        
        await saveToStorage(AUTH_USER_KEY, userData)
        await saveToStorage(AUTH_MODE_KEY, AuthMode.ONLINE)
        
        return {
          success: true,
          data: userData,
        }
      }
      
      return {
        success: false,
        error: apiResult.data?.message || 'Invalid email or password',
      }
    } catch (error) {
      console.error('Error during email/password login:', error)
      return {
        success: false,
        error: 'An error occurred during login',
      }
    }
  }
  
  /**
   * Continue in offline mode
   */
  async continueOffline(): Promise<AuthResult> {
    try {
      // Save offline mode preference
      await saveToStorage(AUTH_MODE_KEY, AuthMode.OFFLINE)
      
      return {
        success: true,
        data: {
          name: 'Offline User',
          email: '',
          profilePic: '',
        },
      }
    } catch (error) {
      console.error('Error continuing offline:', error)
      return {
        success: false,
        error: 'An error occurred',
      }
    }
  }
  
  /**
   * Logout the user
   */
  async logout(): Promise<boolean> {
    try {
      // Get the current auth mode
      const authMode = await loadFromStorage(AUTH_MODE_KEY) as AuthMode
      
      if (authMode === AuthMode.ONLINE) {
        // Logout from the API
        await api.logout()
      }
      
      // Clear auth data
      await saveToStorage(AUTH_USER_KEY, null)
      await saveToStorage(AUTH_MODE_KEY, null)
      
      return true
    } catch (error) {
      console.error('Error during logout:', error)
      return false
    }
  }
}

// Singleton instance
export const authService = new AuthService()