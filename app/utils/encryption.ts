/**
 * Encryption utilities
 */
import CryptoJS from 'crypto-js'
import Config from '../config'

// The secret key used for encryption
const SECRET_KEY = 'secure_vault_app_encryption_key'

/**
 * Encrypt a string
 * @param text The text to encrypt
 * @param key Optional encryption key
 * @returns The encrypted text
 */
export function encrypt(text: string, key: string = SECRET_KEY): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, key).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    return text // Return original text on error
  }
}

/**
 * Decrypt an encrypted string
 * @param encryptedText The encrypted text
 * @param key Optional encryption key 
 * @returns The decrypted text
 */
export function decrypt(encryptedText: string, key: string = SECRET_KEY): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText // Return encrypted text on error
  }
}

/**
 * Generate a random ID
 * @returns A random ID string
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Calculate password strength score (0-100)
 * @param password The password to check
 * @returns A score from 0 (weakest) to 100 (strongest)
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0
  
  let score = 0
  
  // Length contribution (max 25 points)
  const lengthScore = Math.min(password.length * 2, 25)
  score += lengthScore
  
  // Character variety contribution (max 50 points)
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasDigits = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  
  score += hasLowercase ? 10 : 0
  score += hasUppercase ? 10 : 0
  score += hasDigits ? 15 : 0
  score += hasSpecial ? 15 : 0
  
  // Complexity contribution (max 25 points)
  const uniqueChars = new Set(password.split('')).size
  const uniqueRatio = uniqueChars / password.length
  const complexityScore = Math.min(Math.round(uniqueRatio * 25), 25)
  score += complexityScore
  
  return score
}

/**
 * Get password strength category
 * @param score The password strength score (0-100)
 * @returns A string categorizing the password strength
 */
export function getPasswordStrengthCategory(score: number): string {
  if (score < 30) return 'Very Weak'
  if (score < 50) return 'Weak'
  if (score < 70) return 'Moderate'
  if (score < 90) return 'Strong'
  return 'Very Strong'
}

/**
 * Generate a random password
 * @param length The length of the password
 * @param includeUppercase Include uppercase letters
 * @param includeNumbers Include numbers
 * @param includeSymbols Include symbols
 * @returns A random password
 */
export function generatePassword(
  length: number = Config.credential.passwordLength,
  includeUppercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'
  
  // Start with lowercase
  let allChars = lowercaseChars
  
  // Add other char types based on options
  if (includeUppercase) allChars += uppercaseChars
  if (includeNumbers) allChars += numberChars
  if (includeSymbols) allChars += symbolChars
  
  let password = ''
  
  // Ensure at least one character of each type
  if (includeUppercase) {
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
  }
  
  if (includeNumbers) {
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length))
  }
  
  if (includeSymbols) {
    password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length))
  }
  
  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('')
}