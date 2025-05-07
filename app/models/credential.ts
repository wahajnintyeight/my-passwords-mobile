/**
 * Model for credential data
 */
import { types, Instance, SnapshotOut } from 'mobx-state-tree'
import { generateId } from '../utils/encryption'

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
    notes: types.optional(types.string, ''),
    category: types.optional(types.string, 'Uncategorized'),
    favorite: types.optional(types.boolean, false),
    lastUsed: types.optional(types.string, ''),
    createdAt: types.string,
    updatedAt: types.string,
    icon: types.optional(types.string, ''),
    tags: types.optional(types.array(types.string), []),
  })
  .views(self => ({
    /**
     * Get primary domain from website URL
     */
    get domain(): string {
      try {
        if (!self.website) return ''
        
        // Add protocol if missing
        let url = self.website
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url
        }
        
        const urlObj = new URL(url)
        const hostParts = urlObj.hostname.split('.')
        
        // Handle special cases like co.uk, com.au
        if (hostParts.length > 2) {
          const lastTwoParts = hostParts.slice(-2).join('.')
          if (['co.uk', 'com.au', 'co.jp', 'co.nz', 'org.uk'].includes(lastTwoParts)) {
            return hostParts.slice(-3).join('.')
          }
        }
        
        // Return domain without 'www'
        return urlObj.hostname.replace(/^www\./i, '')
      } catch (error) {
        // Return original website if parsing fails
        return self.website
      }
    },
    
    /**
     * Check if credential contains given search term
     */
    matchesSearch(term: string): boolean {
      if (!term) return true
      
      const lowerTerm = term.toLowerCase()
      
      // Check title, website, username, notes, category
      if (self.title.toLowerCase().includes(lowerTerm)) return true
      if (self.website.toLowerCase().includes(lowerTerm)) return true
      if (self.username.toLowerCase().includes(lowerTerm)) return true
      if (self.notes.toLowerCase().includes(lowerTerm)) return true
      if (self.category.toLowerCase().includes(lowerTerm)) return true
      
      // Check domain
      if (self.domain.toLowerCase().includes(lowerTerm)) return true
      
      // Check tags
      if (self.tags.some(tag => tag.toLowerCase().includes(lowerTerm))) return true
      
      return false
    },
  }))
  .actions(self => ({
    /**
     * Update credential properties
     */
    update(newData: Partial<typeof self>): void {
      Object.assign(self, {
        ...newData,
        updatedAt: new Date().toISOString(),
      })
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
      if (index !== -1) {
        self.tags.splice(index, 1)
        self.updatedAt = new Date().toISOString()
      }
    },
    
    /**
     * Set category
     */
    setCategory(category: string): void {
      self.category = category
      self.updatedAt = new Date().toISOString()
    },
  }))

/**
 * Generate default values for a new credential
 */
export const createCredentialDefaults = () => {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: '',
    website: '',
    username: '',
    password: '',
    notes: '',
    category: 'Uncategorized',
    favorite: false,
    lastUsed: '',
    createdAt: now,
    updatedAt: now,
    icon: '',
    tags: [],
  }
}

export interface Credential extends Instance<typeof CredentialModel> {}
export interface CredentialSnapshot extends SnapshotOut<typeof CredentialModel> {}