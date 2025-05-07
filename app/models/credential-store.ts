/**
 * Store for managing credentials
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Credential, CredentialModel, CredentialSnapshot, createCredentialDefaults } from "./credential"
import { withEnvironment } from "./extensions/with-environment"
import { storage } from "../services/storage-service"
import { credentialApi } from "../services/api"
import { encrypt, decrypt, generateId } from "../utils/encryption"
import Config from "../config"

/**
 * Store to manage credential data
 */
export const CredentialStoreModel = types
  .model("CredentialStore")
  .props({
    credentials: types.array(CredentialModel),
    loading: types.optional(types.boolean, false),
    lastSyncDate: types.optional(types.string, ""),
  })
  .extend(withEnvironment)
  .views((self) => ({
    /**
     * Get credential by ID
     */
    getCredentialById(id: string): Credential | undefined {
      return self.credentials.find((credential) => credential.id === id)
    },

    /**
     * Get credentials filtered by category
     */
    getCredentialsByCategory(category: string): Credential[] {
      return self.credentials.filter((credential) => credential.category === category)
    },

    /**
     * Get favorite credentials
     */
    get favoriteCredentials(): Credential[] {
      return self.credentials.filter((credential) => credential.favorite)
    },

    /**
     * Get all unique tags
     */
    get allTags(): string[] {
      const tagsSet = new Set<string>()
      self.credentials.forEach((credential) => {
        credential.tags.forEach((tag) => tagsSet.add(tag))
      })
      return Array.from(tagsSet).sort()
    },

    /**
     * Get credentials filtered by tag
     */
    getCredentialsByTag(tag: string): Credential[] {
      return self.credentials.filter((credential) => credential.tags.includes(tag))
    },
  }))
  .actions((self) => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      self.loading = loading
    },

    /**
     * Set last sync date
     */
    setLastSyncDate(date: string): void {
      self.lastSyncDate = date
    },

    /**
     * Add a credential
     */
    addCredential(credentialData: Partial<CredentialSnapshot>): Credential {
      const newCredential: CredentialSnapshot = {
        ...createCredentialDefaults(),
        ...credentialData,
      }
      
      const credential = self.credentials.push(newCredential)
      this.saveCredentials()
      return self.credentials[credential - 1]
    },

    /**
     * Import multiple credentials
     */
    importCredentials(credentialsData: Partial<CredentialSnapshot>[]): Credential[] {
      const now = new Date().toISOString()
      const newCredentials = credentialsData.map(data => ({
        ...createCredentialDefaults(),
        ...data,
        id: data.id || generateId(),
        createdAt: data.createdAt || now,
        updatedAt: now,
      }))
      
      self.credentials.push(...newCredentials)
      this.saveCredentials()
      return self.credentials.slice(-newCredentials.length)
    },

    /**
     * Update a credential
     */
    updateCredential(id: string, updates: Partial<CredentialSnapshot>): Credential | undefined {
      const credential = self.getCredentialById(id)
      if (credential) {
        credential.update(updates)
        this.saveCredentials()
        return credential
      }
      return undefined
    },

    /**
     * Delete a credential
     */
    deleteCredential(id: string): boolean {
      const index = self.credentials.findIndex((credential) => credential.id === id)
      if (index !== -1) {
        self.credentials.splice(index, 1)
        this.saveCredentials()
        return true
      }
      return false
    },

    /**
     * Delete all credentials
     */
    clearAllCredentials(): void {
      self.credentials.clear()
      this.saveCredentials()
    },

    /**
     * Load credentials from local storage
     */
    async loadCredentials(): Promise<void> {
      self.setLoading(true)
      try {
        const encryptedData = await storage.loadObject<string>(
          `${Config.storage.prefix}credentials`,
          Config.storage.encryption
        )
        
        if (encryptedData) {
          const data = JSON.parse(encryptedData)
          self.credentials.replace(data)
        }
      } catch (error) {
        console.error("Failed to load credentials:", error)
      } finally {
        self.setLoading(false)
      }
    },

    /**
     * Save credentials to local storage
     */
    async saveCredentials(): Promise<void> {
      try {
        const data = JSON.stringify(self.credentials)
        await storage.saveObject(
          `${Config.storage.prefix}credentials`,
          data,
          Config.storage.encryption
        )
      } catch (error) {
        console.error("Failed to save credentials:", error)
      }
    },

    /**
     * Sync credentials with remote server
     */
    async syncCredentials(): Promise<boolean> {
      if (!self.environment.api) return false
      
      self.setLoading(true)
      try {
        // Get server credentials
        const serverCredentials = await credentialApi.getCredentials()
        
        // Merge with local credentials (this is simplified - in a real app, 
        // you'd need a more sophisticated sync algorithm)
        self.credentials.replace(serverCredentials)
        
        // Update last sync time
        self.setLastSyncDate(new Date().toISOString())
        
        // Save to local storage
        await this.saveCredentials()
        
        return true
      } catch (error) {
        console.error("Failed to sync credentials:", error)
        return false
      } finally {
        self.setLoading(false)
      }
    },

    /**
     * Reset the store to its initial state
     */
    reset(): void {
      self.credentials.clear()
      self.loading = false
      self.lastSyncDate = ""
    },
  }))

export interface CredentialStore extends Instance<typeof CredentialStoreModel> {}
export interface CredentialStoreSnapshot extends SnapshotOut<typeof CredentialStoreModel> {}