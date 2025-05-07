/**
 * Service for persistent storage
 */
import AsyncStorage from "@react-native-async-storage/async-storage"
import { encrypt, decrypt } from "../utils/encryption"

// Key to use for encryption of sensitive data
const ENCRYPTION_KEY = "SecureVault_EncryptionKey_V1"

/**
 * Class to handle local storage operations
 */
export class StorageService {
  /**
   * Save data to storage
   * @param key Storage key
   * @param value Value to store
   * @param encrypt Whether to encrypt the data
   */
  async save(key: string, value: string, shouldEncrypt: boolean = false): Promise<void> {
    try {
      const dataToSave = shouldEncrypt ? await encrypt(value, ENCRYPTION_KEY) : value
      await AsyncStorage.setItem(key, dataToSave)
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Load data from storage
   * @param key Storage key
   * @param decrypt Whether to decrypt the data
   */
  async load(key: string, shouldDecrypt: boolean = false): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key)
      
      if (value === null) {
        return null
      }
      
      if (shouldDecrypt) {
        return decrypt(value, ENCRYPTION_KEY)
      }
      
      return value
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Remove data from storage
   * @param key Storage key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Save complex data as JSON
   * @param key Storage key
   * @param value Value to store
   * @param encrypt Whether to encrypt the data
   */
  async saveObject<T>(key: string, value: T, shouldEncrypt: boolean = true): Promise<void> {
    try {
      const jsonString = JSON.stringify(value)
      await this.save(key, jsonString, shouldEncrypt)
    } catch (error) {
      console.error(`Error saving object for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Load complex data from JSON
   * @param key Storage key
   * @param decrypt Whether to decrypt the data
   */
  async loadObject<T>(key: string, shouldDecrypt: boolean = true): Promise<T | null> {
    try {
      const jsonString = await this.load(key, shouldDecrypt)
      
      if (jsonString === null) {
        return null
      }
      
      return JSON.parse(jsonString) as T
    } catch (error) {
      console.error(`Error loading object for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Get all keys with a specific prefix
   * @param prefix Key prefix to search for
   */
  async getKeysWithPrefix(prefix: string): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      return allKeys.filter(key => key.startsWith(prefix))
    } catch (error) {
      console.error(`Error getting keys with prefix ${prefix}:`, error)
      throw error
    }
  }

  /**
   * Clear all data in storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error("Error clearing storage:", error)
      throw error
    }
  }
}

export const storage = new StorageService()
