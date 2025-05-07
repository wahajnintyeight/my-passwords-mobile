/**
 * Helper utilities for storage operations
 */
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Get all stored credential IDs
 */
export async function getStoredCredentialIds(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return keys.filter(key => key.startsWith("credential_"))
  } catch (error) {
    console.error("Error fetching credential IDs:", error)
    return []
  }
}

/**
 * Clear all stored credentials
 */
export async function clearAllCredentials(): Promise<boolean> {
  try {
    const keys = await getStoredCredentialIds()
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys)
    }
    return true
  } catch (error) {
    console.error("Error clearing credentials:", error)
    return false
  }
}

/**
 * Check if storage is available and working
 */
export async function isStorageAvailable(): Promise<boolean> {
  try {
    const testKey = "__storage_test__"
    await AsyncStorage.setItem(testKey, "test")
    await AsyncStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.error("Storage availability test failed:", error)
    return false
  }
}

/**
 * Get storage usage info
 * This is a rough estimation as AsyncStorage doesn't provide direct size info
 */
export async function getStorageUsage(): Promise<{
  itemCount: number
  estimatedSize: string
}> {
  try {
    const keys = await AsyncStorage.getAllKeys()
    let totalSize = 0
    
    // Sample a few items to estimate average size
    const sampleSize = Math.min(keys.length, 10)
    const sampleKeys = keys.slice(0, sampleSize)
    
    for (const key of sampleKeys) {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        totalSize += value.length + key.length
      }
    }
    
    // Calculate average size per item
    const avgSize = sampleSize > 0 ? totalSize / sampleSize : 0
    
    // Estimate total size
    const estimatedTotalBytes = avgSize * keys.length
    
    // Format size
    let estimatedSize: string
    if (estimatedTotalBytes < 1024) {
      estimatedSize = `${estimatedTotalBytes} bytes`
    } else if (estimatedTotalBytes < 1024 * 1024) {
      estimatedSize = `${(estimatedTotalBytes / 1024).toFixed(2)} KB`
    } else {
      estimatedSize = `${(estimatedTotalBytes / (1024 * 1024)).toFixed(2)} MB`
    }
    
    return {
      itemCount: keys.length,
      estimatedSize
    }
  } catch (error) {
    console.error("Error getting storage usage:", error)
    return {
      itemCount: 0,
      estimatedSize: "0 bytes"
    }
  }
}
