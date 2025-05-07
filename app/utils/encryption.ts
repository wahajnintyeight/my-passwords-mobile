/**
 * Utilities for encryption and password operations
 */
import CryptoJS from "crypto-js"

/**
 * Encrypt a string
 * @param text Text to encrypt
 * @param secretKey Encryption key
 */
export function encrypt(text: string, secretKey: string): string {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString()
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Decrypt a string
 * @param encryptedText Encrypted text
 * @param secretKey Encryption key
 */
export function decrypt(encryptedText: string, secretKey: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data. Invalid key or data.")
  }
}

/**
 * Generate a random password
 * @param options Password generation options
 */
export function generatePassword(options: {
  length?: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
}): string {
  const length = options.length || 16
  
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const numberChars = "0123456789"
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  
  // Build the character set based on options
  let chars = ""
  if (options.uppercase !== false) chars += uppercaseChars
  if (options.lowercase !== false) chars += lowercaseChars
  if (options.numbers !== false) chars += numberChars
  if (options.symbols !== false) chars += symbolChars
  
  // Default to lowercase + numbers if nothing selected
  if (!chars) chars = lowercaseChars + numberChars
  
  // Generate the password
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  
  // Ensure the password has at least one character from each selected type
  const types = []
  if (options.uppercase !== false) types.push(uppercaseChars)
  if (options.lowercase !== false) types.push(lowercaseChars)
  if (options.numbers !== false) types.push(numberChars)
  if (options.symbols !== false) types.push(symbolChars)
  
  // Replace characters to ensure all types are included
  for (let i = 0; i < types.length; i++) {
    const typeChars = types[i]
    const randomTypeChar = typeChars[Math.floor(Math.random() * typeChars.length)]
    const randomPosition = Math.floor(Math.random() * length)
    password = password.substring(0, randomPosition) + randomTypeChar + password.substring(randomPosition + 1)
  }
  
  return password
}

/**
 * Hash a string using SHA-256
 * @param text Text to hash
 */
export function hashString(text: string): string {
  return CryptoJS.SHA256(text).toString()
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
}

/**
 * Check if a password has been compromised
 * This is a mock function as the real implementation would require an API call
 * to a service like "Have I Been Pwned"
 */
export function checkPasswordCompromised(password: string): Promise<boolean> {
  // In a real implementation, this would check against a database of known breached passwords
  // For simulation, we'll return false (not compromised) for most passwords
  return Promise.resolve(false)
}
