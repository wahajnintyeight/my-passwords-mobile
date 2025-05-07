/**
 * Hook to initialize and use the root store
 */
import { useEffect, useState } from "react"
import { RootStore, RootStoreModel } from "../root-store"
import { Environment } from "../../services/environment"
import { setupRootStore } from "./setup-root-store"

/**
 * Setup the root store for application state.
 */
let rootStore: RootStore

/**
 * Hook to set up and initialize the root store
 */
export const useInitialRootStore = (callback: () => void | Promise<void> = () => {}) => {
  const [rootStoreReady, setRootStoreReady] = useState<boolean>(!!(rootStore && rootStore.authStore))
  
  // Prepare root store
  useEffect(() => {
    let environment: Environment
    
    // Set up root store
    const initializeRootStore = async () => {
      let setupRootStoreResult = await setupRootStore()
      rootStore = setupRootStoreResult.rootStore
      environment = setupRootStoreResult.environment
      
      if (callback) {
        await callback()
      }
      
      setRootStoreReady(true)
    }

    initializeRootStore()
    
    return () => {
      rootStore = undefined
      environment = undefined
    }
  }, [])

  return { rootStore, rootStoreReady }
}

/**
 * Setup the root store for the application.
 */
export const setupRootStore = async () => {
  let rootStore: RootStore
  let data: any = {}

  try {
    // Create the environment
    const env = new Environment()
    
    // Create the root store
    rootStore = RootStoreModel.create({}, env)
    
    // Initialize auth store
    await rootStore.authStore.initialize()
    
    // Load credentials
    await rootStore.credentialStore.loadCredentials()

    return { rootStore, environment: env }
  } catch (e) {
    // If there's any problems loading the store, then destroy it and create a new one
    rootStore = RootStoreModel.create(data)
    
    return { rootStore, environment: new Environment() }
  }
}
