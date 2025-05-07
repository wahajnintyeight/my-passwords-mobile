/**
 * Store for managing credentials
 */
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Credential, CredentialModel, CredentialSnapshot, createCredentialDefaults } from "./credential"
import { loadFromStorage, saveToStorage } from "../utils/storage-helpers"
import { encryptData, decryptData } from "../utils/encryption"
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
    searchTerm: types.optional(types.string, ""),
    selectedCategory: types.optional(types.string, "all"),
    selectedTag: types.optional(types.string, ""),
  })
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
      if (category === "all") {
        return self.credentials
      }
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
      if (!tag) {
        return self.credentials
      }
      return self.credentials.filter((credential) => credential.tags.includes(tag))
    },

    /**
     * Get filtered and searched credentials
     */
    get filteredCredentials(): Credential[] {
      let filtered = self.credentials

      // Filter by category if selected
      if (self.selectedCategory !== "all") {
        filtered = filtered.filter((c) => c.category === self.selectedCategory)
      }

      // Filter by tag if selected
      if (self.selectedTag) {
        filtered = filtered.filter((c) => c.tags.includes(self.selectedTag))
      }

      // Apply search term if any
      if (self.searchTerm) {
        filtered = filtered.filter((c) => c.matchesSearch(self.searchTerm))
      }

      return filtered
    },

    /**
     * Get all available categories with count
     */
    get categoriesWithCount(): { id: string; name: string; count: number }[] {
      const categories = [
        { id: "all", name: "All Passwords", count: self.credentials.length },
        { id: "website", name: "Websites", count: 0 },
        { id: "email", name: "Email", count: 0 },
        { id: "financial", name: "Financial", count: 0 },
        { id: "personal", name: "Personal", count: 0 },
        { id: "work", name: "Work", count: 0 },
        { id: "other", name: "Other", count: 0 },
      ]

      // Count credentials by category
      self.credentials.forEach((credential) => {
        const category = categories.find((c) => c.id === credential.category)
        if (category) {
          category.count++
        }
      })

      return categories
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
     * Set search term
     */
    setSearchTerm(term: string): void {
      self.searchTerm = term
    },

    /**
     * Set selected category
     */
    setSelectedCategory(category: string): void {
      self.selectedCategory = category
    },

    /**
     * Set selected tag
     */
    setSelectedTag(tag: string): void {
      self.selectedTag = tag
    },

    /**
     * Add a credential
     */
    addCredential(credentialData: Partial<CredentialSnapshot>): Credential {
      const newCredential: CredentialSnapshot = {
        ...createCredentialDefaults(),
        ...credentialData,
      }
      
      self.credentials.push(newCredential)
      this.saveCredentials()
      
      return self.credentials[self.credentials.length - 1]
    },

    /**
     * Import multiple credentials
     */
    importCredentials(credentialsData: Partial<CredentialSnapshot>[]): Credential[] {
      const newCredentials: Credential[] = []
      
      credentialsData.forEach((data) => {
        const newCredential: CredentialSnapshot = {
          ...createCredentialDefaults(),
          ...data,
        }
        
        self.credentials.push(newCredential)
        newCredentials.push(self.credentials[self.credentials.length - 1])
      })
      
      this.saveCredentials()
      
      return newCredentials
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
    loadCredentials: flow(function* () {
      self.setLoading(true)
      
      try {
        const encryptedData = yield loadFromStorage(Config.storage.prefix + "credentials")
        
        if (encryptedData) {
          let credentialsData
          
          if (Config.storage.encryption) {
            const decrypted = yield decryptData(encryptedData)
            credentialsData = JSON.parse(decrypted)
          } else {
            credentialsData = JSON.parse(encryptedData)
          }
          
          if (Array.isArray(credentialsData)) {
            self.credentials.clear()
            credentialsData.forEach((data) => {
              self.credentials.push(data)
            })
          }
        }
      } catch (error) {
        console.error("Error loading credentials:", error)
      } finally {
        self.setLoading(false)
      }
    }),

    /**
     * Save credentials to local storage
     */
    saveCredentials: flow(function* () {
      try {
        const credentialsData = JSON.stringify(self.credentials)
        
        if (Config.storage.encryption) {
          const encrypted = yield encryptData(credentialsData)
          yield saveToStorage(Config.storage.prefix + "credentials", encrypted)
        } else {
          yield saveToStorage(Config.storage.prefix + "credentials", credentialsData)
        }
      } catch (error) {
        console.error("Error saving credentials:", error)
      }
    }),

    /**
     * Sync credentials with remote server
     */
    syncCredentials: flow(function* () {
      if (!self.loading) {
        self.setLoading(true)
        
        try {
          // In a real app, we would sync with the backend here
          // For now, we'll just simulate a successful sync
          
          yield new Promise((resolve) => setTimeout(resolve, 1000))
          
          self.setLastSyncDate(new Date().toISOString())
          console.log("Credentials synced successfully")
          
          return true
        } catch (error) {
          console.error("Error syncing credentials:", error)
          return false
        } finally {
          self.setLoading(false)
        }
      }
      
      return false
    }),

    /**
     * Reset the store to its initial state
     */
    reset(): void {
      self.credentials.clear()
      self.loading = false
      self.lastSyncDate = ""
      self.searchTerm = ""
      self.selectedCategory = "all"
      self.selectedTag = ""
    },
  }))

export interface CredentialStore extends Instance<typeof CredentialStoreModel> {}
export interface CredentialStoreSnapshot extends SnapshotOut<typeof CredentialStoreModel> {}