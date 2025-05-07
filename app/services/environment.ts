/**
 * Environment configuration service
 */
import { Platform } from "react-native"
import Config from "../config"
import { api } from "./api"

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
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // Configure API based on environment
    api.apisauce.axiosConfig.baseURL = Config.apiUrl
  }
  
  /**
   * Get the current device information
   */
  async getDeviceInfo() {
    return {
      os: Platform.OS,
      version: Platform.Version,
      isProd: Config.isProduction,
      isStorybook: false,
    }
  }
  
  /**
   * Setup reactotron based on environment vars
   */
  setupReactotron(config: ReactotronConfig = { name: "App", host: "localhost", port: 9090, enabled: true }) {
    // Only set up in development
    if (!__DEV__) {
      return
    }
    
    // Configure reactotron client here if needed
    // This is needed only for development debugging
  }
}
