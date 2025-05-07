/**
 * API service for communicating with the backend
 */
import { create } from 'apisauce'
import Config from '../config'
import { saveToStorage, loadFromStorage } from '../utils/storage-helpers'

// Session storage keys
const SESSION_ID_KEY = `${Config.storage.prefix}session_id`

// Create the API instance
const api = create({
  baseURL: Config.api.url,
  timeout: Config.api.timeout,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Setup API request/response transformers and interceptors
 */
export const setupAPI = async () => {
  // Try to load session from storage on startup
  const sessionId = await loadFromStorage(SESSION_ID_KEY)
  if (sessionId) {
    api.setHeader('sessionId', sessionId)
  }

  // Add request transformer
  api.addRequestTransform(request => {
    console.log('API Request:', request.url, request.method, request.data)
  })

  // Add response transformer
  api.addResponseTransform(response => {
    console.log('API Response:', response.status, response.data)
    
    // Handle expired session
    if (response.status === 401) {
      // Clear session data if unauthorized
      clearSession()
    }
  })
}

/**
 * Create a new API session
 * @param credentials User login credentials
 * @returns Promise with session data or error
 */
export const createSession = async (credentials: { email: string; password?: string; googleToken?: string }) => {
  try {
    const response = await api.put('/createSession', credentials)
    
    if (response.ok && response.data?.sessionId) {
      // Set session header for all future requests
      await setSession(response.data.sessionId)
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to create session'
    }
  } catch (error) {
    console.error('API error creating session:', error)
    return { 
      success: false, 
      error: 'Network error creating session' 
    }
  }
}

/**
 * Set session ID in storage and headers
 * @param sessionId Session ID from API
 */
export const setSession = async (sessionId: string) => {
  if (sessionId) {
    await saveToStorage(SESSION_ID_KEY, sessionId)
    api.setHeader('sessionId', sessionId)
  }
}

/**
 * Clear session data
 */
export const clearSession = async () => {
  await saveToStorage(SESSION_ID_KEY, null)
  api.deleteHeader('sessionId')
}

/**
 * Get user profile
 * @returns Promise with user data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile')
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to get user profile'
    }
  } catch (error) {
    console.error('API error getting profile:', error)
    return { 
      success: false, 
      error: 'Network error getting user profile' 
    }
  }
}

/**
 * Get all user credentials
 * @returns Promise with credentials
 */
export const getCredentials = async () => {
  try {
    const response = await api.get('/credentials')
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to get credentials'
    }
  } catch (error) {
    console.error('API error getting credentials:', error)
    return { 
      success: false, 
      error: 'Network error getting credentials' 
    }
  }
}

/**
 * Save a credential
 * @param credential Credential data
 * @returns Promise with result
 */
export const saveCredential = async (credential: any) => {
  try {
    const response = await api.post('/credentials', credential)
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to save credential'
    }
  } catch (error) {
    console.error('API error saving credential:', error)
    return { 
      success: false, 
      error: 'Network error saving credential' 
    }
  }
}

/**
 * Update a credential
 * @param id Credential ID
 * @param credential Updated credential data
 * @returns Promise with result
 */
export const updateCredential = async (id: string, credential: any) => {
  try {
    const response = await api.put(`/credentials/${id}`, credential)
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to update credential'
    }
  } catch (error) {
    console.error('API error updating credential:', error)
    return { 
      success: false, 
      error: 'Network error updating credential' 
    }
  }
}

/**
 * Delete a credential
 * @param id Credential ID
 * @returns Promise with result
 */
export const deleteCredential = async (id: string) => {
  try {
    const response = await api.delete(`/credentials/${id}`)
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to delete credential'
    }
  } catch (error) {
    console.error('API error deleting credential:', error)
    return { 
      success: false, 
      error: 'Network error deleting credential' 
    }
  }
}

/**
 * Export credentials for backup
 * @returns Promise with exported data
 */
export const exportCredentials = async () => {
  try {
    const response = await api.get('/credentials/export')
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to export credentials'
    }
  } catch (error) {
    console.error('API error exporting credentials:', error)
    return { 
      success: false, 
      error: 'Network error exporting credentials' 
    }
  }
}

/**
 * Import credentials from backup
 * @param data Credential data to import
 * @returns Promise with result
 */
export const importCredentials = async (data: any) => {
  try {
    const response = await api.post('/credentials/import', data)
    
    if (response.ok) {
      return { success: true, data: response.data }
    }
    
    return { 
      success: false, 
      error: response.data?.error || 'Failed to import credentials'
    }
  } catch (error) {
    console.error('API error importing credentials:', error)
    return { 
      success: false, 
      error: 'Network error importing credentials' 
    }
  }
}

export default {
  api,
  setupAPI,
  createSession,
  setSession,
  clearSession,
  getUserProfile,
  getCredentials,
  saveCredential,
  updateCredential,
  deleteCredential,
  exportCredentials,
  importCredentials
}