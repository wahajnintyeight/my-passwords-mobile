/**
 * Helper functions for accessing local storage
 */
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Save data to local storage
 * @param key Storage key
 * @param value Data to store
 * @returns Promise that resolves when data is saved
 */
export async function saveToStorage(key: string, value: any): Promise<void> {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (error) {
    console.error(`Error saving to storage for key "${key}":`, error)
    throw error
  }
}

/**
 * Load data from local storage
 * @param key Storage key
 * @returns Promise that resolves with the data or null if not found
 */
export async function loadFromStorage(key: string): Promise<any> {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value === null) {
      return null
    }
    
    try {
      // Try to parse as JSON
      return JSON.parse(value)
    } catch (e) {
      // If parsing fails, return the raw string
      return value
    }
  } catch (error) {
    console.error(`Error loading from storage for key "${key}":`, error)
    return null
  }
}

/**
 * Remove data from local storage
 * @param key Storage key
 * @returns Promise that resolves when data is removed
 */
export async function removeFromStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from storage for key "${key}":`, error)
    throw error
  }
}

/**
 * Clear all data from local storage
 * @returns Promise that resolves when all data is cleared
 */
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error('Error clearing storage:', error)
    throw error
  }
}

/**
 * Get all keys from local storage
 * @returns Promise that resolves with an array of keys
 */
export async function getAllStorageKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return keys
  } catch (error) {
    console.error('Error getting all storage keys:', error)
    return []
  }
}

/**
 * Get multiple items from local storage by keys
 * @param keys Array of storage keys
 * @returns Promise that resolves with an object of key-value pairs
 */
export async function getMultipleFromStorage(keys: string[]): Promise<Record<string, any>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys)
    const result: Record<string, any> = {}
    
    for (const [key, value] of pairs) {
      if (value) {
        try {
          // Try to parse as JSON
          result[key] = JSON.parse(value)
        } catch (e) {
          // If parsing fails, store the raw string
          result[key] = value
        }
      }
    }
    
    return result
  } catch (error) {
    console.error('Error getting multiple items from storage:', error)
    return {}
  }
}

/**
 * Remove multiple items from local storage by keys
 * @param keys Array of storage keys
 * @returns Promise that resolves when all items are removed
 */
export async function removeMultipleFromStorage(keys: string[]): Promise<void> {
  try {
    await AsyncStorage.multiRemove(keys)
  } catch (error) {
    console.error('Error removing multiple items from storage:', error)
    throw error
  }
}

/**
 * Get all items from local storage
 * @returns Promise that resolves with an object of all key-value pairs
 */
export async function getAllFromStorage(): Promise<Record<string, any>> {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return await getMultipleFromStorage(keys)
  } catch (error) {
    console.error('Error getting all items from storage:', error)
    return {}
  }
}

/**
 * Check if a key exists in local storage
 * @param key Storage key
 * @returns Promise that resolves with boolean indicating if key exists
 */
export async function hasKey(key: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key)
    return value !== null
  } catch (error) {
    console.error(`Error checking if key "${key}" exists:`, error)
    return false
  }
}