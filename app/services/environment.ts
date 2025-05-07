/**
 * Environment configuration service
 */
import { Platform } from 'react-native'

/**
 * Default configuration for various environments
 */
export interface ReactotronConfig {
  name: string
  host: string
  port: number
  enabled: boolean
}

/**
 * Environment types for the app
 */
export enum EnvironmentType {
  DEV = 'development',
  STAGING = 'staging',
  PROD = 'production',
}

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  /**
   * Current environment (development, staging, production)
   */
  environmentType: EnvironmentType

  /**
   * Is this running on a mobile device or simulator?
   */
  isMobile: boolean

  /**
   * Is this running on a web browser?
   */
  isWeb: boolean

  /**
   * Is this an iOS device?
   */
  isIOS: boolean

  /**
   * Is this an Android device?
   */
  isAndroid: boolean

  constructor() {
    // Default to development environment
    this.environmentType = __DEV__ ? EnvironmentType.DEV : EnvironmentType.PROD
    
    // Set platform flags
    this.isWeb = Platform.OS === 'web'
    this.isIOS = Platform.OS === 'ios'
    this.isAndroid = Platform.OS === 'android'
    this.isMobile = this.isIOS || this.isAndroid
    
    // Initialize any environment services
    this.setupReactotron()
  }

  /**
   * Get the current device information
   */
  async getDeviceInfo() {
    return {
      os: Platform.OS,
      version: Platform.Version,
      isEmulator: this.isEmulator(),
    }
  }

  /**
   * Check if app is running on an emulator/simulator
   */
  isEmulator(): boolean {
    // In a real app, we would use additional checks to detect emulators
    // For this demo, we'll just return false
    return false
  }

  /**
   * Setup reactotron based on environment vars
   */
  setupReactotron(config: ReactotronConfig = { 
    name: "App", 
    host: "localhost", 
    port: 9090, 
    enabled: true 
  }) {
    // In a full implementation, this would set up Reactotron for debugging
    // For this demo, we'll just log that it would be set up
    if (__DEV__ && config.enabled) {
      console.log('Reactotron would be configured here in a full implementation')
    }
  }

  /**
   * Is this a development environment?
   */
  isDevelopment(): boolean {
    return this.environmentType === EnvironmentType.DEV
  }

  /**
   * Is this a production environment?
   */
  isProduction(): boolean {
    return this.environmentType === EnvironmentType.PROD
  }

  /**
   * Is this a staging environment?
   */
  isStaging(): boolean {
    return this.environmentType === EnvironmentType.STAGING
  }
}