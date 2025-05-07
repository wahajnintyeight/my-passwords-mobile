/**
 * Model for credential data
 */
import { types, Instance, SnapshotOut } from 'mobx-state-tree'
import { generateId } from '../utils/encryption'
import Config from '../config'

/**
 * Credential model
 */
export const CredentialModel = types
  .model('Credential')
  .props({
    id: types.identifier,
    title: types.string,
    website: types.string,
    username: types.string,
    password: types.string,
    notes: types.maybeNull(types.string),
    category: types.optional(types.string, Config.credential.defaultCategory),
    favorite: types.optional(types.boolean, false),
    createdAt: types.optional(types.string, () => new Date().toISOString()),
    updatedAt: types.optional(types.string, () => new Date().toISOString()),
    tags: types.optional(types.array(types.string), []),
  })
  .views(self => ({
    /**
     * Get primary domain from website URL
     */
    get domain(): string {
      try {
        if (!self.website) return ''
        
        // If it doesn't have http://, add it
        let url = self.website
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        
        const parsedUrl = new URL(url)
        // Get domain without subdomain
        const hostParts = parsedUrl.hostname.split('.')
        
        // Handle cases like co.uk, com.au, etc.
        if (hostParts.length > 2 && 
            ((hostParts[hostParts.length - 2].length <= 3 && hostParts[hostParts.length - 1].length <= 3) ||
             hostParts[hostParts.length - 1] === 'localhost')) {
          return hostParts.slice(-3).join('.')
        }
        
        return hostParts.slice(-2).join('.')
      } catch (error) {
        // If URL parsing fails, just return the website as is or empty string
        return self.website || ''
      }
    },
    
    /**
     * Check if credential contains given search term
     */
    matchesSearch(term: string): boolean {
      if (!term) return true
      
      const searchTerm = term.toLowerCase()
      return (
        self.title.toLowerCase().includes(searchTerm) ||
        self.username.toLowerCase().includes(searchTerm) ||
        self.website.toLowerCase().includes(searchTerm) ||
        (self.notes && self.notes.toLowerCase().includes(searchTerm)) ||
        self.domain.toLowerCase().includes(searchTerm) ||
        self.category.toLowerCase().includes(searchTerm) ||
        self.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
  }))
  .actions(self => ({
    /**
     * Update credential properties
     */
    update(newData: Partial<typeof self>): void {
      Object.keys(newData).forEach(key => {
        // Skip id to prevent changing it
        if (key === 'id') return
        
        // Handle special cases like tags that need reference copying
        if (key === 'tags' && Array.isArray(newData.tags)) {
          self.tags.replace(newData.tags)
        } else if (key in self) {
          // @ts-ignore - ignoring to avoid having to type every property
          self[key] = newData[key]
        }
      })
      
      // Update the updatedAt timestamp
      self.updatedAt = new Date().toISOString()
    },
    
    /**
     * Toggle favorite status
     */
    toggleFavorite(): void {
      self.favorite = !self.favorite
      self.updatedAt = new Date().toISOString()
    },
    
    /**
     * Add a tag
     */
    addTag(tag: string): void {
      if (tag && !self.tags.includes(tag)) {
        self.tags.push(tag)
        self.updatedAt = new Date().toISOString()
      }
    },
    
    /**
     * Remove a tag
     */
    removeTag(tag: string): void {
      const index = self.tags.indexOf(tag)
      if (index >= 0) {
        self.tags.splice(index, 1)
        self.updatedAt = new Date().toISOString()
      }
    },
    
    /**
     * Set category
     */
    setCategory(category: string): void {
      if (category) {
        self.category = category
        self.updatedAt = new Date().toISOString()
      }
    }
  }))

/**
 * Generate default values for a new credential
 */
export const createCredentialDefaults = () => {
  return {
    id: generateId(),
    title: '',
    website: '',
    username: '',
    password: '',
    notes: '',
    category: Config.credential.defaultCategory,
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  }
}

export interface Credential extends Instance<typeof CredentialModel> {}
export interface CredentialSnapshot extends SnapshotOut<typeof CredentialModel> {}