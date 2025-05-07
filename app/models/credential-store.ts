/**
 * Store for managing credentials
 */
import { types, flow, Instance, SnapshotOut } from 'mobx-state-tree'
import { withEnvironment } from './extensions/with-environment'
import { withRootStore } from './extensions/with-root-store'
import { CredentialModel, Credential, CredentialSnapshot, createCredentialDefaults } from './credential'
import { saveToStorage, loadFromStorage } from '../utils/storage-helpers'
import { generateId } from '../utils/encryption'
import Config from '../config'

/**
 * Storage keys
 */
const CREDENTIALS_STORAGE_KEY = `${Config.storage.prefix}credentials`
const LAST_SYNC_STORAGE_KEY = `${Config.storage.prefix}lastSync`

/**
 * Store to manage credential data
 */
export const CredentialStoreModel = types
  .model('CredentialStore')
  .props({
    credentials: types.array(CredentialModel),
    loading: types.optional(types.boolean, false),
    lastSyncDate: types.optional(types.string, ''),
    searchTerm: types.optional(types.string, ''),
    selectedCategory: types.optional(types.string, ''),
    selectedTag: types.optional(types.string, ''),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
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
      if (!category) return self.credentials
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
      const tags = new Set<string>()
      self.credentials.forEach(cred => {
        cred.tags.forEach(tag => tags.add(tag))
      })
      return [...tags].sort()
    },
    
    /**
     * Get credentials filtered by tag
     */
    getCredentialsByTag(tag: string): Credential[] {
      if (!tag) return self.credentials
      return self.credentials.filter(cred => cred.tags.includes(tag))
    },
    
    /**
     * Get filtered and searched credentials
     */
    get filteredCredentials(): Credential[] {
      let result = self.credentials
      
      // Filter by category if selected
      if (self.selectedCategory) {
        result = result.filter(cred => cred.category === self.selectedCategory)
      }
      
      // Filter by tag if selected
      if (self.selectedTag) {
        result = result.filter(cred => cred.tags.includes(self.selectedTag))
      }
      
      // Filter by search term
      if (self.searchTerm) {
        result = result.filter(cred => cred.matchesSearch(self.searchTerm))
      }
      
      // Sort by title
      return result.slice().sort((a, b) => a.title.localeCompare(b.title))
    },
    
    /**
     * Get all available categories with count
     */
    get categoriesWithCount(): { id: string; name: string; count: number }[] {
      const categories = new Map<string, number>()
      
      // Count credentials in each category
      self.credentials.forEach(cred => {
        const category = cred.category
        categories.set(category, (categories.get(category) || 0) + 1)
      })
      
      // Convert to array and sort
      return Array.from(categories.entries())
        .map(([name, count]) => ({
          id: name,
          name,
          count,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
  }))
  .actions(self => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      self.loading = loading
    },
    
    /**
     * Set last sync date
     */
    setLastSyncDate(date: string) {
      self.lastSyncDate = date
      saveToStorage(LAST_SYNC_STORAGE_KEY, date)
    },
    
    /**
     * Set search term
     */
    setSearchTerm(term: string) {
      self.searchTerm = term
    },
    
    /**
     * Set selected category
     */
    setSelectedCategory(category: string) {
      self.selectedCategory = category
    },
    
    /**
     * Set selected tag
     */
    setSelectedTag(tag: string) {
      self.selectedTag = tag
    },
    
    /**
     * Add a credential
     */
    addCredential(credentialData: Partial<CredentialSnapshot>): Credential {
      const newCredential: CredentialSnapshot = {
        ...createCredentialDefaults(),
        ...credentialData,
        id: credentialData.id || generateId(),
      }
      
      const credential = self.credentials.push(newCredential)[0]
      
      // Save to storage
      this.saveCredentials()
      
      return credential
    },
    
    /**
     * Import multiple credentials
     */
    importCredentials(credentialsData: Partial<CredentialSnapshot>[]): Credential[] {
      const newCredentials: Credential[] = []
      
      credentialsData.forEach(data => {
        const newCredential: CredentialSnapshot = {
          ...createCredentialDefaults(),
          ...data,
          id: data.id || generateId(),
        }
        
        const credential = self.credentials.push(newCredential)[0]
        newCredentials.push(credential)
      })
      
      // Save to storage
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
        
        // Save to storage
        this.saveCredentials()
        
        return credential
      }
      
      return undefined
    },
    
    /**
     * Delete a credential
     */
    deleteCredential(id: string): boolean {
      const index = self.credentials.findIndex(c => c.id === id)
      
      if (index >= 0) {
        self.credentials.splice(index, 1)
        
        // Save to storage
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
      
      // Save to storage
      this.saveCredentials()
    },
    
    /**
     * Load credentials from local storage
     */
    loadCredentials: flow(function* () {
      try {
        self.setLoading(true)
        
        // Load credentials
        const storedCredentials = yield loadFromStorage(CREDENTIALS_STORAGE_KEY) || []
        
        // Load last sync date
        const lastSync = yield loadFromStorage(LAST_SYNC_STORAGE_KEY) || ''
        self.lastSyncDate = lastSync
        
        // Clear existing credentials
        self.credentials.clear()
        
        // Add stored credentials
        if (Array.isArray(storedCredentials) && storedCredentials.length > 0) {
          storedCredentials.forEach((cred: CredentialSnapshot) => {
            self.credentials.push(cred)
          })
        }
        
        self.setLoading(false)
        return true
      } catch (error) {
        console.error('Error loading credentials:', error)
        self.setLoading(false)
        return false
      }
    }),
    
    /**
     * Save credentials to local storage
     */
    saveCredentials: flow(function* () {
      try {
        // Get credential snapshots
        const credentialSnapshots = self.credentials.map(c => ({
          id: c.id,
          title: c.title,
          website: c.website,
          username: c.username,
          password: c.password,
          notes: c.notes,
          category: c.category,
          favorite: c.favorite,
          lastUsed: c.lastUsed,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          icon: c.icon,
          tags: c.tags.slice(),
        }))
        
        // Save to storage
        yield saveToStorage(CREDENTIALS_STORAGE_KEY, credentialSnapshots)
        
        return true
      } catch (error) {
        console.error('Error saving credentials:', error)
        return false
      }
    }),
    
    /**
     * Sync credentials with remote server
     */
    syncWithServer: flow(function* () {
      try {
        // Check if we're online
        if (self.rootStore.authStore.offlineMode) {
          return {
            success: false,
            message: 'Cannot sync in offline mode',
          }
        }
        
        self.setLoading(true)
        
        // Get credential snapshots
        const credentialSnapshots = self.credentials.map(c => ({
          id: c.id,
          title: c.title,
          website: c.website,
          username: c.username,
          password: c.password,
          notes: c.notes,
          category: c.category,
          favorite: c.favorite,
          lastUsed: c.lastUsed,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          icon: c.icon,
          tags: c.tags.slice(),
        }))
        
        // Sync with server
        const result = yield self.environment.api.syncCredentials(
          credentialSnapshots,
          self.lastSyncDate
        )
        
        if (result.ok && result.data) {
          // Update last sync date
          const now = new Date().toISOString()
          self.setLastSyncDate(now)
          
          // Handle server credentials (merge/update)
          if (result.data.credentials && Array.isArray(result.data.credentials)) {
            // Clear existing credentials
            self.credentials.clear()
            
            // Add server credentials
            result.data.credentials.forEach((serverCred: CredentialSnapshot) => {
              self.credentials.push(serverCred)
            })
            
            // Save to local storage
            yield self.saveCredentials()
          }
          
          self.setLoading(false)
          return {
            success: true,
            message: 'Sync completed successfully',
          }
        }
        
        self.setLoading(false)
        return {
          success: false,
          message: result.data?.message || 'Failed to sync with server',
        }
      } catch (error) {
        console.error('Error syncing with server:', error)
        self.setLoading(false)
        return {
          success: false,
          message: 'Error syncing with server',
        }
      }
    }),
    
    /**
     * Reset the store to its initial state
     */
    reset(): void {
      self.credentials.clear()
      self.loading = false
      self.lastSyncDate = ''
      self.searchTerm = ''
      self.selectedCategory = ''
      self.selectedTag = ''
    },
  }))

export interface CredentialStore extends Instance<typeof CredentialStoreModel> {}
export interface CredentialStoreSnapshot extends SnapshotOut<typeof CredentialStoreModel> {}