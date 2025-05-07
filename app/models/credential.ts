/**
 * Model for credential data
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { getDomainFromUrl } from "../utils/format-helpers"
import { generateId } from "../utils/encryption"

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
    favorite: types.optional(types.boolean, false),
    category: types.optional(types.string, "website"),
    icon: types.optional(types.string, ""),
    lastUpdated: types.optional(types.string, ""),
    createdAt: types.string,
    tags: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    /**
     * Get primary domain from website URL
     */
    get domain(): string {
      return getDomainFromUrl(self.website)
    },
  }))
  .actions((self) => ({
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
        self.domain.toLowerCase().includes(searchTerm) ||
        self.notes.toLowerCase().includes(searchTerm) ||
        self.category.toLowerCase().includes(searchTerm) ||
        self.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      )
    },

    /**
     * Update credential properties
     */
    update(newData: Partial<typeof self>): void {
      Object.assign(self, { ...newData, lastUpdated: new Date().toISOString() })
    },

    /**
     * Toggle favorite status
     */
    toggleFavorite(): void {
      self.favorite = !self.favorite
      self.lastUpdated = new Date().toISOString()
    },

    /**
     * Add a tag
     */
    addTag(tag: string): void {
      if (!self.tags.includes(tag)) {
        self.tags.push(tag)
        self.lastUpdated = new Date().toISOString()
      }
    },

    /**
     * Remove a tag
     */
    removeTag(tag: string): void {
      const index = self.tags.indexOf(tag)
      if (index !== -1) {
        self.tags.splice(index, 1)
        self.lastUpdated = new Date().toISOString()
      }
    },

    /**
     * Set category
     */
    setCategory(category: string): void {
      self.category = category
      self.lastUpdated = new Date().toISOString()
    },
  }))

/**
 * Generate default values for a new credential
 */
export const createCredentialDefaults = () => {
  return {
    id: generateId(),
    title: "",
    website: "",
    username: "",
    password: "",
    notes: "",
    favorite: false,
    category: "website",
    icon: "",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tags: [],
  }
}

export interface Credential extends Instance<typeof CredentialModel> {}
export interface CredentialSnapshot extends SnapshotOut<typeof CredentialModel> {}