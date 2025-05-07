/**
 * Helper functions for formatting and manipulating data
 */

/**
 * Extract domain from a URL string
 * @param url URL string to extract domain from
 * @returns The domain name without protocol or paths
 */
export function getDomainFromUrl(url: string): string {
  if (!url) return ""
  
  try {
    // Add protocol if not present to make URL parsing work
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }
    
    const urlObj = new URL(url)
    // Remove www. prefix if present
    return urlObj.hostname.replace(/^www\./, "")
  } catch (e) {
    // If URL parsing fails, try a simple regex approach
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)
    return match ? match[1] : url
  }
}

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (e) {
    return dateString
  }
}

/**
 * Format a date string to include time
 * @param dateString ISO date string
 * @returns Formatted date with time
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (e) {
    return dateString
  }
}

/**
 * Get time elapsed since the given date in a human-readable format
 * @param dateString ISO date string
 * @returns Human-readable elapsed time (e.g., "2 days ago")
 */
export function getTimeAgo(dateString: string): string {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) {
      return interval === 1 
        ? "1 year ago" 
        : `${interval} years ago`
    }
    
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) {
      return interval === 1 
        ? "1 month ago" 
        : `${interval} months ago`
    }
    
    interval = Math.floor(seconds / 86400)
    if (interval >= 1) {
      return interval === 1 
        ? "1 day ago" 
        : `${interval} days ago`
    }
    
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      return interval === 1 
        ? "1 hour ago" 
        : `${interval} hours ago`
    }
    
    interval = Math.floor(seconds / 60)
    if (interval >= 1) {
      return interval === 1 
        ? "1 minute ago" 
        : `${interval} minutes ago`
    }
    
    return seconds < 5 ? "just now" : `${Math.floor(seconds)} seconds ago`
  } catch (e) {
    return dateString
  }
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param text Text to truncate
 * @param length Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (!text) return ""
  if (text.length <= length) return text
  
  return text.substring(0, length) + "..."
}

/**
 * Generate a random password with configurable options
 * @param length Password length
 * @param options Configuration options for password generation
 * @returns Generated password
 */
export function generatePassword(
  length = 12,
  options = {
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  }
): string {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numberChars = "0123456789"
  const symbolChars = "!@#$%^&*()_-+=<>?"
  
  let validChars = ""
  if (options.lowercase) validChars += lowercaseChars
  if (options.uppercase) validChars += uppercaseChars
  if (options.numbers) validChars += numberChars
  if (options.symbols) validChars += symbolChars
  
  // Ensure at least lowercase is used if nothing is selected
  if (!validChars) validChars = lowercaseChars
  
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length)
    password += validChars[randomIndex]
  }
  
  return password
}

/**
 * Calculate password strength score (0-100)
 * @param password Password to evaluate
 * @returns Strength score from a scale of 0-100
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0
  
  const length = password.length
  let score = 0
  
  // Basic length check
  score += Math.min(length * 4, 40)
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 10
  if (/[^A-Za-z0-9]/.test(password)) score += 15
  
  // Repeating character penalty
  const repeats = password.match(/(.)\1+/g)
  if (repeats) {
    score -= repeats.reduce((p, c) => p + c.length, 0)
  }
  
  // Common pattern penalty
  if (/^(123|abc|qwerty|password|admin)/i.test(password)) {
    score -= 15
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score))
}

/**
 * Get a descriptive label for password strength
 * @param score Password strength score (0-100)
 * @returns Text label describing the strength
 */
export function getPasswordStrengthLabel(score: number): string {
  if (score < 20) return "Very Weak"
  if (score < 40) return "Weak"
  if (score < 60) return "Moderate"
  if (score < 80) return "Strong"
  return "Very Strong"
}