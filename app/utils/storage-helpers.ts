/**
 * Utilities for working with AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encrypt, decrypt } from './encryption'
import Config from '../config'

/**
 * Save data to storage with optional encryption
 * @param key The storage key
 * @param data The data to store
 * @param useEncryption Whether to encrypt the data
 */
export async function saveToStorage(
  key: string,
  data: any,
  useEncryption: boolean = Config.storage.encryption
): Promise<void> {
  try {
    if (data === null || data === undefined) {
      // Remove the item when data is null
      await AsyncStorage.removeItem(key)
      return
    }

    // Convert data to string
    const jsonValue = JSON.stringify(data)
    
    // Encrypt if needed
    const valueToStore = useEncryption ? encrypt(jsonValue) : jsonValue
    
    // Store in AsyncStorage
    await AsyncStorage.setItem(key, valueToStore)
  } catch (error) {
    console.error('Error saving to storage:', error)
    throw error
  }
}

/**
 * Load data from storage with optional decryption
 * @param key The storage key
 * @param useEncryption Whether the data is encrypted
 */
export async function loadFromStorage(
  key: string,
  useEncryption: boolean = Config.storage.encryption
): Promise<any> {
  try {
    // Get from AsyncStorage
    const value = await AsyncStorage.getItem(key)
    
    if (value === null) {
      return null
    }
    
    // Decrypt if needed
    const jsonValue = useEncryption ? decrypt(value) : value
    
    // Parse JSON
    return JSON.parse(jsonValue)
  } catch (error) {
    console.error('Error loading from storage:', error)
    return null
  }
}

/**
 * Remove data from storage
 * @param key The storage key
 */
export async function removeFromStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from storage:', error)
    throw error
  }
}

/**
 * Clear all app storage
 * @param preserveKeys Array of keys to preserve
 */
export async function clearStorage(preserveKeys: string[] = []): Promise<void> {
  try {
    if (preserveKeys.length === 0) {
      // Clear all storage
      await AsyncStorage.clear()
      return
    }
    
    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys()
    
    // Filter out keys to preserve
    const keysToRemove = allKeys.filter(key => !preserveKeys.includes(key))
    
    // Remove filtered keys
    await AsyncStorage.multiRemove(keysToRemove)
  } catch (error) {
    console.error('Error clearing storage:', error)
    throw error
  }
}