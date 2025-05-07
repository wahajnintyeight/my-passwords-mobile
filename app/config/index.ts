/**
 * App configuration
 */

export interface AppConfig {
  /**
   * The app name
   */
  name: string
  
  /**
   * API endpoint
   */
  api: {
    url: string
    timeout: number
  }
  
  /**
   * Should we catch errors in the React render lifecycle?
   */
  catchErrors: boolean
  
  /**
   * Should we show development screens in non-production builds?
   */
  showDevScreens: boolean
  
  /**
   * Is this a production build?
   */
  isProduction: boolean
  
  /**
   * Should we enable OCR scanning in this build?
   */
  enableOcr: boolean
  
  /**
   * Default credential settings
   */
  credential: {
    passwordLength: number
    defaultCategory: string
  }
  
  /**
   * Auto-lock settings
   */
  autoLock: {
    enabled: boolean
    timeout: number // in milliseconds
  }
  
  /**
   * Storage configuration
   */
  storage: {
    prefix: string
    encryption: boolean
  }
  
  /**
   * Default settings
   */
  defaults: {
    biometricEnabled: boolean
    darkMode: boolean
    notificationsEnabled: boolean
  }
}

/**
 * Default app configuration
 */
const Config: AppConfig = {
  name: "SecureVault",
  
  api: {
    url: "https://api.wahaj.codes:8443/v2/api",
    timeout: 15000, // 15 seconds
  },
  
  catchErrors: true,
  showDevScreens: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",
  enableOcr: true,
  
  credential: {
    passwordLength: 16,
    defaultCategory: "Uncategorized",
  },
  
  autoLock: {
    enabled: true,
    timeout: 5 * 60 * 1000, // 5 minutes
  },
  
  storage: {
    prefix: "secureVault_",
    encryption: true,
  },
  
  defaults: {
    biometricEnabled: true,
    darkMode: false,
    notificationsEnabled: true,
  },
}

export default Config