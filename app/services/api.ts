/**
 * API service for interacting with the backend
 */
import { create, ApisauceInstance, ApiResponse } from 'apisauce'
import { loadFromStorage, saveToStorage } from '../utils/storage-helpers'
import Config from '../config'

/**
 * Storage keys
 */
const API_SESSION_KEY = 'secureVault_apiSession'

/**
 * Response types
 */
export interface ApiResult<T> {
  ok: boolean
  status: number
  data?: T
  problem?: string
  originalError?: any
}

/**
 * API service
 */
class ApiService {
  /**
   * The apisauce instance
   */
  api: ApisauceInstance

  /**
   * Session ID from server
   */
  sessionId: string | null = null

  /**
   * Set up the API
   */
  constructor() {
    this.api = create({
      baseURL: Config.api.url,
      timeout: Config.api.timeout,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    // Auto-load session if available
    this.loadSession()
  }

  /**
   * Load session from storage
   */
  async loadSession(): Promise<boolean> {
    try {
      const session = await loadFromStorage(API_SESSION_KEY)
      if (session && session.sessionId) {
        this.sessionId = session.sessionId
        
        // Set session header for all future requests
        this.api.setHeader('X-Session-ID', this.sessionId)
        return true
      }
      return false
    } catch (error) {
      console.error('Error loading session:', error)
      return false
    }
  }

  /**
   * Create a new session
   */
  async createSession(): Promise<ApiResult<{ sessionId: string }>> {
    try {
      const response: ApiResponse<any> = await this.api.put('/createSession', {})
      
      if (response.ok && response.data && response.data.sessionId) {
        // Save session
        this.sessionId = response.data.sessionId
        await saveToStorage(API_SESSION_KEY, { sessionId: this.sessionId })
        
        // Set session header for all future requests
        this.api.setHeader('X-Session-ID', this.sessionId)
      }
      
      return {
        ok: response.ok,
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error creating session:', error)
      return {
        ok: false,
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }

  /**
   * Ensure session is valid, create new if needed
   */
  async ensureSession(): Promise<boolean> {
    try {
      // Check if we have a session
      if (!this.sessionId) {
        // Try to load from storage
        const loadResult = await this.loadSession()
        
        // If still no session, create a new one
        if (!loadResult) {
          const createResult = await this.createSession()
          return createResult.ok
        }
      }
      
      return true
    } catch (error) {
      console.error('Error ensuring session:', error)
      return false
    }
  }

  /**
   * Authenticate with the API using credentials
   */
  async login(email: string, password: string): Promise<ApiResult<any>> {
    try {
      // Ensure we have a session
      await this.ensureSession()
      
      // Make login request
      const response: ApiResponse<any> = await this.api.post('/auth/login', {
        email,
        password,
      })
      
      return {
        ok: response.ok,
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error during login:', error)
      return {
        ok: false,
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }

  /**
   * Authenticate with the API using Google token
   */
  async loginWithGoogle(token: string): Promise<ApiResult<any>> {
    try {
      // Ensure we have a session
      await this.ensureSession()
      
      // Make Google login request
      const response: ApiResponse<any> = await this.api.post('/auth/google', {
        token,
      })
      
      return {
        ok: response.ok,
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error during Google login:', error)
      return {
        ok: false,
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }

  /**
   * Logout from the API
   */
  async logout(): Promise<ApiResult<any>> {
    try {
      // Ensure we have a session
      await this.ensureSession()
      
      // Make logout request
      const response: ApiResponse<any> = await this.api.post('/auth/logout', {})
      
      // Clear session
      this.sessionId = null
      this.api.deleteHeader('X-Session-ID')
      await saveToStorage(API_SESSION_KEY, null)
      
      return {
        ok: response.ok || true, // Consider logout successful even if API fails
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error during logout:', error)
      
      // Clear session anyway
      this.sessionId = null
      this.api.deleteHeader('X-Session-ID')
      await saveToStorage(API_SESSION_KEY, null)
      
      return {
        ok: true, // Consider logout successful even if API fails
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }

  /**
   * Sync credentials with the server
   */
  async syncCredentials(credentials: any[], lastSync: string): Promise<ApiResult<any>> {
    try {
      // Ensure we have a session
      await this.ensureSession()
      
      // Make sync request
      const response: ApiResponse<any> = await this.api.post('/credentials/sync', {
        credentials,
        lastSync,
      })
      
      return {
        ok: response.ok,
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error syncing credentials:', error)
      return {
        ok: false,
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }

  /**
   * Process OCR scan image
   */
  async processOcrImage(imageBase64: string): Promise<ApiResult<any>> {
    try {
      // Ensure we have a session
      await this.ensureSession()
      
      // Make OCR request
      const response: ApiResponse<any> = await this.api.post('/ocr/process', {
        image: imageBase64,
      })
      
      return {
        ok: response.ok,
        status: response.status || 0,
        data: response.data,
        problem: response.problem,
        originalError: response.originalError,
      }
    } catch (error) {
      console.error('Error processing OCR image:', error)
      return {
        ok: false,
        status: 0,
        problem: 'NETWORK_ERROR',
        originalError: error,
      }
    }
  }
}

export const api = new ApiService()