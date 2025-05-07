/**
 * Store for managing credentials
 */
import { types, flow, Instance, SnapshotOut } from 'mobx-state-tree'
import { CredentialModel, Credential, CredentialSnapshot, createCredentialDefaults } from './credential'
import { withEnvironment } from './extensions/with-environment'
import { withRootStore } from './extensions/with-root-store'
import { saveToStorage, loadFromStorage } from '../utils/storage-helpers'
import { generateId } from '../utils/encryption'
import apiService from '../services/api'
import Config from '../config'

// Storage keys
const CREDENTIALS_STORAGE_KEY = `${Config.storage.prefix}credentials`
const LAST_SYNC_KEY = `${Config.storage.prefix}last_sync`

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
      return self.credentials.find(credential => credential.id === id)
    },
    
    /**
     * Get credentials filtered by category
     */
    getCredentialsByCategory(category: string): Credential[] {
      if (!category) return self.credentials
      return self.credentials.filter(credential => credential.category === category)
    },
    
    /**
     * Get favorite credentials
     */
    get favoriteCredentials(): Credential[] {
      return self.credentials.filter(credential => credential.favorite)
    },
    
    /**
     * Get all unique tags
     */
    get allTags(): string[] {
      const tagsSet = new Set<string>()
      self.credentials.forEach(credential => {
        credential.tags.forEach(tag => tagsSet.add(tag))
      })
      return Array.from(tagsSet).sort()
    },
    
    /**
     * Get credentials filtered by tag
     */
    getCredentialsByTag(tag: string): Credential[] {
      if (!tag) return self.credentials
      return self.credentials.filter(credential => credential.tags.includes(tag))
    },
    
    /**
     * Get filtered and searched credentials
     */
    get filteredCredentials(): Credential[] {
      let filtered = self.credentials
      
      // Apply category filter
      if (self.selectedCategory) {
        filtered = filtered.filter(credential => credential.category === self.selectedCategory)
      }
      
      // Apply tag filter
      if (self.selectedTag) {
        filtered = filtered.filter(credential => credential.tags.includes(self.selectedTag))
      }
      
      // Apply search
      if (self.searchTerm) {
        filtered = filtered.filter(credential => credential.matchesSearch(self.searchTerm))
      }
      
      // Sort by title
      return filtered.slice().sort((a, b) => a.title.localeCompare(b.title))
    },
    
    /**
     * Get all available categories with count
     */
    get categoriesWithCount(): { id: string; name: string; count: number }[] {
      const categoriesMap = new Map<string, number>()
      
      // Count credentials in each category
      self.credentials.forEach(credential => {
        const category = credential.category
        categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1)
      })
      
      // Convert to array and sort
      return Array.from(categoriesMap.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
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
        id: credentialData.id || generateId(),
        title: credentialData.title || '',
        website: credentialData.website || '',
        username: credentialData.username || '',
        password: credentialData.password || '',
        notes: credentialData.notes || '',
        category: credentialData.category || Config.credential.defaultCategory,
        favorite: credentialData.favorite || false,
        createdAt: credentialData.createdAt || new Date().toISOString(),
        updatedAt: credentialData.updatedAt || new Date().toISOString(),
        tags: credentialData.tags || [],
      }
      
      const credential = CredentialModel.create(newCredential)
      self.credentials.push(credential)
      
      // Save to storage
      self.saveCredentials()
      
      return credential
    },
    
    /**
     * Import multiple credentials
     */
    importCredentials(credentialsData: Partial<CredentialSnapshot>[]): Credential[] {
      const newCredentials: Credential[] = []
      
      credentialsData.forEach(data => {
        const newCredential: CredentialSnapshot = {
          id: data.id || generateId(),
          title: data.title || '',
          website: data.website || '',
          username: data.username || '',
          password: data.password || '',
          notes: data.notes || '',
          category: data.category || Config.credential.defaultCategory,
          favorite: data.favorite || false,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          tags: data.tags || [],
        }
        
        const credential = CredentialModel.create(newCredential)
        self.credentials.push(credential)
        newCredentials.push(credential)
      })
      
      // Save to storage
      self.saveCredentials()
      
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
        self.saveCredentials()
        
        return credential
      }
      
      return undefined
    },
    
    /**
     * Delete a credential
     */
    deleteCredential(id: string): boolean {
      const index = self.credentials.findIndex(credential => credential.id === id)
      
      if (index >= 0) {
        self.credentials.splice(index, 1)
        
        // Save to storage
        self.saveCredentials()
        
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
      self.saveCredentials()
    },
    
    /**
     * Load credentials from local storage
     */
    loadCredentials: flow(function* () {
      self.setLoading(true)
      
      try {
        const storedCredentials = yield loadFromStorage(CREDENTIALS_STORAGE_KEY)
        const lastSync = yield loadFromStorage(LAST_SYNC_KEY)
        
        if (storedCredentials) {
          self.credentials.clear()
          storedCredentials.forEach((cred: CredentialSnapshot) => {
            self.credentials.push(CredentialModel.create(cred))
          })
        }
        
        if (lastSync) {
          self.setLastSyncDate(lastSync)
        }
        
        return true
      } catch (error) {
        console.error('Error loading credentials:', error)
        return false
      } finally {
        self.setLoading(false)
      }
    }),
    
    /**
     * Save credentials to local storage
     */
    saveCredentials: flow(function* () {
      try {
        yield saveToStorage(CREDENTIALS_STORAGE_KEY, self.credentials.toJSON())
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
      if (!self.rootStore.authStore.authenticated) {
        console.warn('Cannot sync credentials: Not authenticated')
        return { success: false, error: 'Not authenticated' }
      }
      
      self.setLoading(true)
      
      try {
        // Get credentials from server
        const response = yield apiService.getCredentials()
        
        if (response.success && response.data) {
          // Merge with local credentials giving priority to newer updates
          const serverCredentials = response.data
          const localCredMap = new Map()
          
          // Build map of local credentials by ID
          self.credentials.forEach(cred => {
            localCredMap.set(cred.id, cred)
          })
          
          // Create or update local credentials based on server data
          serverCredentials.forEach((serverCred: CredentialSnapshot) => {
            const localCred = localCredMap.get(serverCred.id)
            
            if (!localCred) {
              // New credential from server
              self.credentials.push(CredentialModel.create(serverCred))
            } else {
              // Compare dates and update if server is newer
              const serverDate = new Date(serverCred.updatedAt || 0).getTime()
              const localDate = new Date(localCred.updatedAt || 0).getTime()
              
              if (serverDate > localDate) {
                localCred.update(serverCred)
              }
            }
            
            // Remove from map to track processed items
            localCredMap.delete(serverCred.id)
          })
          
          // Any remaining local credentials need to be sent to server
          for (const [_, localCred] of localCredMap.entries()) {
            yield apiService.saveCredential(localCred.toJSON())
          }
          
          // Update sync timestamp
          const now = new Date().toISOString()
          self.setLastSyncDate(now)
          yield saveToStorage(LAST_SYNC_KEY, now)
          
          // Save merged credentials to local storage
          yield self.saveCredentials()
          
          return { success: true }
        } else {
          return { 
            success: false, 
            error: response.error || 'Failed to sync credentials' 
          }
        }
      } catch (error) {
        console.error('Error syncing credentials:', error)
        return { 
          success: false, 
          error: 'Network error during sync' 
        }
      } finally {
        self.setLoading(false)
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
    }
  }))

export interface CredentialStore extends Instance<typeof CredentialStoreModel> {}
export interface CredentialStoreSnapshot extends SnapshotOut<typeof CredentialStoreModel> {}