/**
 * Helper utilities for OCR processing
 */

/**
 * Extract credentials from OCR text
 * @param text The OCR processed text
 */
export function extractCredentialsFromText(text: string): {
  username?: string
  password?: string
  website?: string
  title?: string
} {
  if (!text) return {}
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()
  const lines = text.split(/\r?\n/)
  
  // Initialize result
  const result: {
    username?: string
    password?: string
    website?: string
    title?: string
  } = {}
  
  // Username patterns
  const usernamePatterns = [
    /email[:\s]*([^\s]+@[^\s]+)/i,
    /username[:\s]*([^\s]+)/i,
    /login[:\s]*([^\s]+)/i,
    /user[:\s]*([^\s]+)/i,
    /([^\s]+@[^\s]+)/i, // Look for email format
  ]
  
  // Password patterns
  const passwordPatterns = [
    /password[:\s]*([^\s]+)/i,
    /passcode[:\s]*([^\s]+)/i,
    /pin[:\s]*([0-9]+)/i,
  ]
  
  // Website patterns (look for common domains)
  const websitePatterns = [
    /(https?:\/\/[^\s]+)/i,
    /www\.[^\s]+/i,
    /([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63})/i,
  ]
  
  // Title patterns (often appears in headers or form titles)
  const titlePatterns = [
    /sign in to ([^\n]+)/i,
    /login to ([^\n]+)/i,
    /welcome to ([^\n]+)/i,
  ]
  
  // Look through each line for specific fields
  for (const line of lines) {
    // Check for username
    if (!result.username) {
      for (const pattern of usernamePatterns) {
        const match = line.match(pattern)
        if (match && match[1]) {
          result.username = match[1].trim()
          break
        }
      }
      
      // Explicit field checks
      if (!result.username && 
          (line.toLowerCase().includes('email') || 
           line.toLowerCase().includes('username') || 
           line.toLowerCase().includes('user'))) {
        // The next line might contain the value
        const index = lines.indexOf(line)
        if (index >= 0 && index < lines.length - 1) {
          const nextLine = lines[index + 1].trim()
          if (nextLine && !nextLine.toLowerCase().includes('password')) {
            result.username = nextLine
          }
        }
      }
    }
    
    // Check for password
    if (!result.password) {
      for (const pattern of passwordPatterns) {
        const match = line.match(pattern)
        if (match && match[1]) {
          result.password = match[1].trim()
          break
        }
      }
      
      // Explicit field checks
      if (!result.password && line.toLowerCase().includes('password')) {
        // The next line might contain the password
        const index = lines.indexOf(line)
        if (index >= 0 && index < lines.length - 1) {
          const nextLine = lines[index + 1].trim()
          if (nextLine && 
              !nextLine.toLowerCase().includes('username') && 
              !nextLine.toLowerCase().includes('remember') &&
              !nextLine.toLowerCase().includes('forgot')) {
            result.password = nextLine
          }
        }
      }
    }
    
    // Check for website
    if (!result.website) {
      for (const pattern of websitePatterns) {
        const match = line.match(pattern)
        if (match && match[0]) {
          result.website = match[0].trim()
          break
        }
      }
    }
    
    // Check for title
    if (!result.title) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern)
        if (match && match[1]) {
          result.title = match[1].trim()
          break
        }
      }
    }
  }
  
  // If we have a website but no title, try to derive title from the website
  if (result.website && !result.title) {
    try {
      let domain = result.website
      // Remove protocol
      domain = domain.replace(/^https?:\/\//, '')
      // Remove www.
      domain = domain.replace(/^www\./, '')
      // Remove path
      domain = domain.split('/')[0]
      // Extract domain name
      const parts = domain.split('.')
      if (parts.length >= 2) {
        // Capitalize first letter
        result.title = parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1)
      }
    } catch (error) {
      console.error("Error extracting title from website:", error)
    }
  }
  
  return result
}
