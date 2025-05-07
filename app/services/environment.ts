/**
 * Environment configuration
 */
import { api } from './api'
import { authService } from './auth-service'

/**
 * Environment interface
 */
export interface Environment {
  api: typeof api
  authService: typeof authService
}

/**
 * Default environment
 */
export const DEFAULT_ENVIRONMENT: Environment = {
  api,
  authService,
}