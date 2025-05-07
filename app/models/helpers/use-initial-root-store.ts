/**
 * Helper function to setup and initialize the root store
 */
import { onSnapshot } from "mobx-state-tree"
import { useEffect, useState } from "react"
import { createEnvironment, Environment } from "../extensions/with-environment"
import { RootStore, RootStoreModel } from "../root-store"
import * as storage from "../../utils/storage-helpers"

/**
 * Setup the environment
 */
async function setupEnvironment() {
  const env = createEnvironment()
  return env
}

/**
 * Setup the root store
 */
async function setupRootStoreFromEnvironment(env: Environment) {
  const rootStore = RootStoreModel.create({}, env)
  
  // Set up store references
  rootStore.authStore.setRootStore(rootStore)
  rootStore.credentialStore.setRootStore(rootStore)

  // Initialize data
  await rootStore.authStore.initialize()
  await rootStore.credentialStore.loadCredentials()
  
  // Track changes and save to storage
  onSnapshot(rootStore, snapshot => {
    console.log("Snapshot updated:", snapshot)
  })

  return rootStore
}

/**
 * The key we'll use for storing our root state
 */
const ROOT_STATE_STORAGE_KEY = "root"

/**
 * Setup the root store for the application.
 */
export function useInitialRootStore(callback: () => void | (() => void)) {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [restoredState, setRestoredState] = useState(false)

  // Set up the stores asynchronously
  useEffect(() => {
    let cancelFn: (() => void) | undefined
    let env: Environment

    const initStores = async () => {
      env = await setupEnvironment()
      const store = await setupRootStoreFromEnvironment(env)
      setRootStore(store)
      setRestoredState(true)
      cancelFn = callback()
    }

    initStores()

    return () => {
      if (cancelFn) cancelFn()
    }
  }, [callback])

  return { rootStore, restoredState: restoredState }
}