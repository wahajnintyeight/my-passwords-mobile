/**
 * Utilities for encryption and secure data handling
 */
import * as Crypto from 'expo-crypto'
import CryptoJS from 'crypto-js'

// Default encryption key, in production this would be securely stored in environment variables
// or secure storage, and unique per user
const DEFAULT_ENCRYPTION_KEY = "secureVaultAppEncryptionKey2023!"

/**
 * Generate a unique ID using cryptographic random values
 * @returns Unique identifier string
 */
export function generateId(): string {
  return Crypto.randomUUID()
}

/**
 * Generate a cryptographically secure random value
 * @param length Length of the random value
 * @returns Random string
 */
export function generateRandomValue(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    // Use crypto-secure random number generation
    const randomValues = new Uint8Array(1)
    Crypto.getRandomBytes(randomValues)
    result += charset[randomValues[0] % charset.length]
  }
  
  return result
}

/**
 * Encrypt data using AES encryption
 * @param data Data to encrypt
 * @param key Optional encryption key (uses default if not provided)
 * @returns Encrypted string
 */
export async function encryptData(data: string, key: string = DEFAULT_ENCRYPTION_KEY): Promise<string> {
  return CryptoJS.AES.encrypt(data, key).toString()
}

/**
 * Decrypt data using AES encryption
 * @param encryptedData Encrypted data string
 * @param key Optional encryption key (uses default if not provided)
 * @returns Decrypted string
 */
export async function decryptData(encryptedData: string, key: string = DEFAULT_ENCRYPTION_KEY): Promise<string> {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * Hash a string using SHA-256
 * @param data String to hash
 * @returns Hashed string
 */
export async function hashString(data: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  )
}

/**
 * Securely compare two strings in constant time
 * This helps prevent timing attacks when comparing sensitive values
 * @param a First string
 * @param b Second string
 * @returns True if strings are equal
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Mask a sensitive string (like credit card) for display
 * @param text String to mask
 * @param visibleStartChars Number of characters to show at start
 * @param visibleEndChars Number of characters to show at end
 * @returns Masked string
 */
export function maskSensitiveText(
  text: string,
  visibleStartChars: number = 4,
  visibleEndChars: number = 4
): string {
  if (!text) return ""
  if (text.length <= visibleStartChars + visibleEndChars) {
    return text
  }
  
  const start = text.substring(0, visibleStartChars)
  const end = text.substring(text.length - visibleEndChars)
  const maskedLength = text.length - visibleStartChars - visibleEndChars
  const mask = "•".repeat(maskedLength)
  
  return `${start}${mask}${end}`
}

/**
 * Calculate a unique hash for a set of credential data
 * Useful for detecting duplicate entries
 * @param data Credential data to hash
 * @returns Hash string
 */
export async function calculateCredentialHash(data: {
  website: string
  username: string
  password?: string
}): Promise<string> {
  const stringToHash = `${data.website.toLowerCase()}:${data.username.toLowerCase()}`
  return await hashString(stringToHash)
}