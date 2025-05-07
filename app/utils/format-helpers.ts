/**
 * Helper utilities for formatting
 */

/**
 * Format a date string
 * @param dateString Date string to format
 * @param format Desired format (default: relative)
 */
export function formatDate(
  dateString: string,
  format: "relative" | "short" | "long" = "relative"
): string {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  
  // Invalid date
  if (isNaN(date.getTime())) return ""
  
  if (format === "relative") {
    return getRelativeTimeString(date)
  } else if (format === "short") {
    return date.toLocaleDateString()
  } else {
    return date.toLocaleString()
  }
}

/**
 * Get relative time string (e.g. "2 hours ago")
 * @param date Date to convert
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSecs < 60) {
    return "just now"
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * Format a URL string nicely
 * @param url URL string to format
 */
export function formatUrl(url: string): string {
  if (!url) return ""
  
  try {
    // Add protocol if missing
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    
    const urlObj = new URL(url)
    let hostname = urlObj.hostname
    
    // Remove www. prefix
    hostname = hostname.replace(/^www\./, "")
    
    return hostname
  } catch (error) {
    // If parsing fails, return original
    return url
  }
}

/**
 * Get password strength score (0-100)
 * @param password Password to evaluate
 */
export function getPasswordStrength(password: string): {
  score: number
  label: "weak" | "fair" | "good" | "strong" | "very strong"
  color: string
} {
  if (!password) {
    return { score: 0, label: "weak", color: "#FA5252" }
  }
  
  let score = 0
  
  // Length
  if (password.length > 0) score += 10
  if (password.length >= 8) score += 10
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  
  // Complexity
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^a-zA-Z0-9]/.test(password)) score += 10
  
  // Mix of character types
  let typesCount = 0
  if (/[a-z]/.test(password)) typesCount++
  if (/[A-Z]/.test(password)) typesCount++
  if (/[0-9]/.test(password)) typesCount++
  if (/[^a-zA-Z0-9]/.test(password)) typesCount++
  
  score += (typesCount - 1) * 5
  
  // Common patterns
  if (/(.)\1\1/.test(password)) score -= 10 // Repeated characters
  if (/^(123|abc|qwerty|password|admin|letmein)/i.test(password)) score -= 20
  
  // Cap the score at 100
  score = Math.min(100, Math.max(0, score))
  
  // Determine label and color
  let label: "weak" | "fair" | "good" | "strong" | "very strong"
  let color: string
  
  if (score < 20) {
    label = "weak"
    color = "#FA5252" // Red
  } else if (score < 40) {
    label = "fair"
    color = "#FD7E14" // Orange
  } else if (score < 60) {
    label = "good"
    color = "#FCC419" // Yellow
  } else if (score < 80) {
    label = "strong"
    color = "#40C057" // Green
  } else {
    label = "very strong"
    color = "#228BE6" // Blue
  }
  
  return { score, label, color }
}
