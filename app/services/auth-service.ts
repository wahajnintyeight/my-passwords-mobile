/**
 * Authentication service
 */
import * as AuthSession from 'expo-auth-session'
import { Platform } from 'react-native'
import apiService from './api'

// Google Auth configuration
const GOOGLE_AUTH_CONFIG = {
  clientId: Platform.select({
    ios: 'YOUR_IOS_CLIENT_ID',
    android: 'YOUR_ANDROID_CLIENT_ID',
    web: 'YOUR_WEB_CLIENT_ID'
  }),
  scopes: ['profile', 'email'],
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'securevault',
    useProxy: true
  })
}

/**
 * Login with Google OAuth
 * @returns Promise with authentication result
 */
export const loginWithGoogle = async () => {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com')
    
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_AUTH_CONFIG.clientId!,
      scopes: GOOGLE_AUTH_CONFIG.scopes,
      redirectUri: GOOGLE_AUTH_CONFIG.redirectUri,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Token
    })
    
    const result = await request.promptAsync(discovery)
    
    if (result.type === 'success' && result.authentication?.accessToken) {
      // Send token to backend for verification and session creation
      const response = await apiService.createSession({
        email: '',  // This will be extracted from the token on the backend
        googleToken: result.authentication.accessToken
      })
      
      return response
    }
    
    return {
      success: false,
      error: 'Google authentication failed'
    }
  } catch (error) {
    console.error('Error in Google authentication:', error)
    return {
      success: false,
      error: 'Error during Google authentication'
    }
  }
}

/**
 * Login with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with authentication result
 */
export const loginWithEmailPassword = async (email: string, password: string) => {
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required'
    }
  }
  
  // Call API to create session
  return await apiService.createSession({ email, password })
}

/**
 * Logout current user
 */
export const logout = async () => {
  // Clear session data
  await apiService.clearSession()
}

/**
 * Get current user profile
 * @returns Promise with user profile data
 */
export const getCurrentUser = async () => {
  return await apiService.getUserProfile()
}

/**
 * Initialize authentication state
 * Checks for existing session tokens and validates them
 * @returns Promise with authentication result
 */
export const initializeAuth = async () => {
  try {
    // API service already loads session ID on startup
    // Just check if it's valid by making a request
    const userResponse = await apiService.getUserProfile()
    
    return {
      success: userResponse.success,
      data: userResponse.data,
      error: userResponse.error
    }
  } catch (error) {
    console.error('Error initializing auth:', error)
    return {
      success: false,
      error: 'Authentication initialization failed'
    }
  }
}

export default {
  loginWithGoogle,
  loginWithEmailPassword,
  logout,
  getCurrentUser,
  initializeAuth
}