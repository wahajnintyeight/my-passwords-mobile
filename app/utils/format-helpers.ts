/**
 * Helper functions for formatting and transforming data
 */

/**
 * Format a date string to a human-readable format
 * @param dateString Date string to format
 * @param showTime Whether to include the time
 * @returns Formatted date string
 */
export function formatDate(dateString: string, showTime: boolean = false): string {
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
    
    if (showTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    
    return date.toLocaleDateString(undefined, options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format a relative time (e.g., "2 days ago")
 * @param dateString Date string to format
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
    
    if (diffSecs < 60) {
      return 'just now'
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
    } else {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`
    }
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return dateString
  }
}

/**
 * Extract domain from a URL string
 * @param url URL string
 * @returns Domain name
 */
export function extractDomain(url: string): string {
  if (!url) return ''
  
  try {
    // Add protocol if missing
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'https://' + url
    }
    
    const urlObj = new URL(url)
    let domain = urlObj.hostname
    
    // Remove 'www.' prefix if present
    if (domain.startsWith('www.')) {
      domain = domain.substring(4)
    }
    
    return domain
  } catch (error) {
    // If URL parsing fails, try a simple regex
    try {
      const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (innerError) {
      console.error('Error extracting domain with regex:', innerError)
    }
    
    console.error('Error extracting domain:', error)
    return url
  }
}

/**
 * Get the base domain (e.g., 'example.com' from 'sub.example.com')
 * @param domain Domain name
 * @returns Base domain
 */
export function getBaseDomain(domain: string): string {
  try {
    // Split by dots
    const parts = domain.split('.')
    
    // If only 2 parts (or fewer), return as is
    if (parts.length <= 2) {
      return domain
    }
    
    // Handle special cases like co.uk, com.au, etc.
    const secondLevelDomains = ['co', 'com', 'org', 'net', 'edu', 'gov', 'mil']
    const topLevelDomains = ['uk', 'au', 'ca', 'nz', 'za', 'sg', 'jp', 'hk', 'in']
    
    // Check if it's a special case with second-level domain
    if (
      parts.length >= 3 && 
      secondLevelDomains.includes(parts[parts.length - 2]) && 
      topLevelDomains.includes(parts[parts.length - 1])
    ) {
      // Return last 3 parts (e.g., example.co.uk)
      return parts.slice(-3).join('.')
    }
    
    // Otherwise return last 2 parts (e.g., example.com)
    return parts.slice(-2).join('.')
  } catch (error) {
    console.error('Error getting base domain:', error)
    return domain
  }
}

/**
 * Get initials from a name
 * @param name Name to get initials from
 * @param count Maximum number of initials
 * @returns Initials string
 */
export function getInitials(name: string, count: number = 2): string {
  if (!name) return ''
  
  try {
    // Split by spaces
    const parts = name.split(' ').filter(part => part.length > 0)
    
    // If empty after filtering, return empty string
    if (parts.length === 0) {
      return ''
    }
    
    // If only one part, return first 1-2 characters
    if (parts.length === 1) {
      return parts[0].substring(0, count).toUpperCase()
    }
    
    // Get first letter of each part
    let initials = parts.map(part => part.charAt(0)).join('')
    
    // Limit to count
    return initials.substring(0, count).toUpperCase()
  } catch (error) {
    console.error('Error getting initials:', error)
    return name.substring(0, count).toUpperCase()
  }
}

/**
 * Format a file size
 * @param bytes Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number, decimals: number = 1): string {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}