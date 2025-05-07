/**
 * This file provides an interface to the environment settings
 * that are injected into the app container
 */
import { types, getEnv as getEnvironment } from "mobx-state-tree"
import config from "../config"

/**
 * The environment interface
 */
export interface Environment {
  /**
   * Current environment mode
   */
  mode: "production" | "development" | "test"
  
  /**
   * Additional environment variables
   */
  [key: string]: any
}

/**
 * Default environment settings
 */
export const DEFAULT_ENVIRONMENT: Environment = {
  mode: config.isProduction ? "production" : "development",
  api: {
    url: config.api.url,
    timeout: config.api.timeout
  },
}

/**
 * Environment model for use with MST
 */
export const EnvironmentStoreModel = types
  .model("EnvironmentStore")
  .props({
    mode: types.optional(
      types.enumeration(["production", "development", "test"]), 
      DEFAULT_ENVIRONMENT.mode
    ),
  })
  .actions(self => ({
    /**
     * Set environment mode
     */
    setMode(value: "production" | "development" | "test") {
      self.mode = value
    }
  }))

/**
 * Get the environment from the store
 */
export function getEnv(self: any) {
  return getEnvironment(self)
}

export default DEFAULT_ENVIRONMENT