/**
 * Hook to setup and initialize the root store of the application
 */
import { useEffect, useState } from "react"
import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreModel } from "../root-store"
import { Environment } from "../../services/environment"

/**
 * Setup the root store for the application
 */
export const useInitialRootStore = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let _rootStore: RootStore

    // Create the store
    _rootStore = RootStoreModel.create({
      authStore: {},
      credentialStore: {},
    })

    // Set environment
    _rootStore.environment = new Environment()

    // Initialize any async store data
    const initialize = async () => {
      // Load credential data from storage
      await _rootStore.credentialStore.loadCredentials()

      // Try to load auth state
      await _rootStore.authStore.initialize()

      // Track changes
      onSnapshot(_rootStore, (snapshot) => {
        console.log("Snapshot: ", snapshot)
      })

      // All done!
      setRootStore(_rootStore)
      setInitialized(true)
    }

    initialize()

    return () => {
      // Cleanup if needed
    }
  }, [])

  return { rootStore, initialized }
}