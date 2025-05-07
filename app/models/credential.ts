/**
 * Model for credential data
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Credential model
 */
export const CredentialModel = types
  .model("Credential")
  .props({
    id: types.identifier,
    title: types.string,
    website: types.string,
    username: types.string,
    password: types.string,
    notes: types.optional(types.string, ""),
    createdAt: types.string,
    updatedAt: types.maybe(types.string),
    favorite: types.optional(types.boolean, false),
    category: types.optional(types.string, ""),
    tags: types.optional(types.array(types.string), []),
  })
  .views(self => ({
    /**
     * Get primary domain from website URL
     */
    get domain(): string {
      try {
        if (!self.website) return ""
        // Try to extract domain from URL
        let url = self.website
        if (!url.startsWith("http")) {
          url = "https://" + url
        }
        const hostname = new URL(url).hostname
        // Remove www. prefix if present
        return hostname.replace(/^www\./, "")
      } catch (error) {
        // If URL parsing fails, just return the original website
        return self.website
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
        self.website.toLowerCase().includes(searchTerm) ||
        self.username.toLowerCase().includes(searchTerm) ||
        self.notes.toLowerCase().includes(searchTerm)
      )
    }
  }))
  .actions(self => ({
    /**
     * Update credential properties
     */
    update(newData: Partial<typeof self>): void {
      Object.assign(self, {
        ...newData,
        updatedAt: new Date().toISOString()
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
      if (!self.tags.includes(tag)) {
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
    }
  }))

export interface Credential extends Instance<typeof CredentialModel> {}
export interface CredentialSnapshot extends SnapshotOut<typeof CredentialModel> {}
