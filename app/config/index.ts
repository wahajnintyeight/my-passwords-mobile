/**
 * App configuration
 */
export default {
  /**
   * The app name
   */
  name: "SecureVault",
  
  /**
   * API endpoint
   */
  apiUrl: "https://api.wahaj.codes:8443/v2/api",
  
  /**
   * Should we catch errors in the React render lifecycle?
   */
  catchErrors: true,
  
  /**
   * Should we show development screens in non-production builds?
   */
  showDevScreens: __DEV__,
  
  /**
   * Is this a production build?
   */
  isProduction: !__DEV__,

  /**
   * Should we enable OCR scanning in this build?
   */
  enableOCR: true,
  
  /**
   * Default credential settings
   */
  defaultCredentialSettings: {
    passwordLength: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  
  /**
   * Auto-lock settings
   */
  autoLock: {
    enabled: true,
    timeout: 60, // seconds
    biometricEnabled: true,
  },
  
  /**
   * Storage configuration
   */
  storage: {
    prefix: "securevault_",
    encryption: true,
  },
  
  /**
   * Default settings
   */
  defaultSettings: {
    theme: "light",
    hidePasswords: true,
    autoFill: true,
  },
}
