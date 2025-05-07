/**
 * Store for managing credentials
 */
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { CredentialModel, CredentialSnapshot, Credential } from "./credential"
import { withEnvironment } from "./extensions/with-environment"
import { credentialApi } from "../services/api"
import { storage } from "../services/storage-service"

const CREDENTIALS_STORAGE_KEY = "credentials"
const LAST_SYNC_KEY = "last_sync_timestamp"

/**
 * Store to manage credential data
 */
export const CredentialStoreModel = types
  .model("CredentialStore")
  .props({
    credentials: types.array(CredentialModel),
    isLoading: types.optional(types.boolean, false),
    lastSyncDate: types.maybe(types.string),
  })
  .extend(withEnvironment)
  .views(self => ({
    /**
     * Get credential by ID
     */
    getCredentialById(id: string): Credential | undefined {
      return self.credentials.find(cred => cred.id === id)
    },
    
    /**
     * Get credentials filtered by category
     */
    getCredentialsByCategory(category: string): Credential[] {
      return self.credentials.filter(cred => cred.category === category)
    },
    
    /**
     * Get favorite credentials
     */
    get favoriteCredentials(): Credential[] {
      return self.credentials.filter(cred => cred.favorite)
    },
    
    /**
     * Get all unique tags
     */
    get allTags(): string[] {
      const tagsSet = new Set<string>()
      self.credentials.forEach(cred => {
        cred.tags.forEach(tag => tagsSet.add(tag))
      })
      return Array.from(tagsSet).sort()
    },
    
    /**
     * Get credentials filtered by tag
     */
    getCredentialsByTag(tag: string): Credential[] {
      return self.credentials.filter(cred => cred.tags.includes(tag))
    }
  }))
  .actions(self => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      self.isLoading = loading
    },
    
    /**
     * Set last sync date
     */
    setLastSyncDate(date: string): void {
      self.lastSyncDate = date
      storage.save(LAST_SYNC_KEY, date)
    },
    
    /**
     * Add a credential
     */
    addCredential: flow(function* (credential: Partial<CredentialSnapshot>) {
      self.setLoading(true)
      try {
        // Ensure we have the required fields
        const newCredential: CredentialSnapshot = {
          id: credential.id || Date.now().toString(),
          title: credential.title || "",
          website: credential.website || "",
          username: credential.username || "",
          password: credential.password || "",
          notes: credential.notes || "",
          createdAt: credential.createdAt || new Date().toISOString(),
          updatedAt: credential.updatedAt,
          favorite: credential.favorite || false,
          category: credential.category || "",
          tags: credential.tags || [],
        }
        
        // Add to local store
        self.credentials.push(newCredential)
        
        // Save to local storage
        yield self.saveToStorage()
        
        return newCredential
      } catch (error) {
        console.error("Add credential error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Import multiple credentials
     */
    importCredentials: flow(function* (credentials: Partial<CredentialSnapshot>[]) {
      self.setLoading(true)
      try {
        // Add the new credentials
        credentials.forEach(cred => {
          self.credentials.push({
            id: cred.id || Date.now().toString() + Math.random().toString(36).substring(2, 10),
            title: cred.title || "",
            website: cred.website || "",
            username: cred.username || "",
            password: cred.password || "",
            notes: cred.notes || "",
            createdAt: cred.createdAt || new Date().toISOString(),
            updatedAt: cred.updatedAt,
            favorite: cred.favorite || false,
            category: cred.category || "",
            tags: cred.tags || [],
          })
        })
        
        // Save to local storage
        yield self.saveToStorage()
        
        return self.credentials
      } catch (error) {
        console.error("Import credentials error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Update a credential
     */
    updateCredential: flow(function* (id: string, data: Partial<CredentialSnapshot>) {
      self.setLoading(true)
      try {
        const credential = self.getCredentialById(id)
        
        if (!credential) {
          throw new Error(`Credential with ID ${id} not found`)
        }
        
        // Update properties and set updated timestamp
        credential.update({
          ...data,
          updatedAt: new Date().toISOString()
        })
        
        // Save to local storage
        yield self.saveToStorage()
        
        return credential
      } catch (error) {
        console.error("Update credential error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Delete a credential
     */
    deleteCredential: flow(function* (id: string) {
      self.setLoading(true)
      try {
        const index = self.credentials.findIndex(cred => cred.id === id)
        
        if (index === -1) {
          throw new Error(`Credential with ID ${id} not found`)
        }
        
        // Remove from array
        self.credentials.splice(index, 1)
        
        // Save to local storage
        yield self.saveToStorage()
        
        return true
      } catch (error) {
        console.error("Delete credential error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Delete all credentials
     */
    deleteAllCredentials: flow(function* () {
      self.setLoading(true)
      try {
        // Clear credentials array
        self.credentials.clear()
        
        // Save to local storage
        yield self.saveToStorage()
        
        return true
      } catch (error) {
        console.error("Delete all credentials error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Load credentials from local storage
     */
    loadCredentials: flow(function* () {
      self.setLoading(true)
      try {
        // Load from storage
        const storedCredentials = yield storage.loadObject<CredentialSnapshot[]>(CREDENTIALS_STORAGE_KEY, true)
        
        if (storedCredentials) {
          // Replace current credentials with stored ones
          self.credentials.clear()
          storedCredentials.forEach(cred => self.credentials.push(cred))
        }
        
        // Load last sync date
        const lastSync = yield storage.load(LAST_SYNC_KEY)
        if (lastSync) {
          self.lastSyncDate = lastSync
        }
        
        return self.credentials
      } catch (error) {
        console.error("Load credentials error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Save credentials to local storage
     */
    saveToStorage: flow(function* () {
      try {
        const credentialsData = self.credentials.map(cred => ({
          id: cred.id,
          title: cred.title,
          website: cred.website,
          username: cred.username,
          password: cred.password,
          notes: cred.notes,
          createdAt: cred.createdAt,
          updatedAt: cred.updatedAt,
          favorite: cred.favorite,
          category: cred.category,
          tags: cred.tags.slice(),
        }))
        
        yield storage.saveObject(CREDENTIALS_STORAGE_KEY, credentialsData, true)
      } catch (error) {
        console.error("Save to storage error:", error)
        throw error
      }
    }),
    
    /**
     * Sync credentials with remote server
     */
    syncCredentials: flow(function* () {
      self.setLoading(true)
      try {
        // First get remote credentials
        const remoteCredentials = yield credentialApi.getCredentials()
        
        // Merge with local credentials (complex syncing logic would go here)
        // For simplicity, we're just doing a basic merge
        // In a real app, you'd handle conflicts, deleted items, etc.
        
        // Add any remote credentials not in local store
        remoteCredentials.forEach(remoteCred => {
          const localCred = self.getCredentialById(remoteCred.id)
          if (!localCred) {
            self.credentials.push(remoteCred)
          } else if (
            remoteCred.updatedAt && 
            localCred.updatedAt && 
            new Date(remoteCred.updatedAt) > new Date(localCred.updatedAt)
          ) {
            // Remote is newer, update local
            localCred.update(remoteCred)
          }
        })
        
        // Push local credentials to remote
        for (const localCred of self.credentials) {
          const remoteCred = remoteCredentials.find(cred => cred.id === localCred.id)
          if (!remoteCred) {
            // New local credential, push to server
            yield credentialApi.createCredential(localCred)
          } else if (
            localCred.updatedAt && 
            remoteCred.updatedAt && 
            new Date(localCred.updatedAt) > new Date(remoteCred.updatedAt)
          ) {
            // Local is newer, update remote
            yield credentialApi.updateCredential(localCred.id, localCred)
          }
        }
        
        // Save sync date
        const now = new Date().toISOString()
        self.setLastSyncDate(now)
        
        // Save to local storage
        yield self.saveToStorage()
        
        return true
      } catch (error) {
        console.error("Sync credentials error:", error)
        throw error
      } finally {
        self.setLoading(false)
      }
    })
  }))

export interface CredentialStore extends Instance<typeof CredentialStoreModel> {}
export interface CredentialStoreSnapshot extends SnapshotOut<typeof CredentialStoreModel> {}
