/**
 * Model for credential data
 */
import { Instance, SnapshotOut, types } from "mobx-state-tree"
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
    category: types.optional(types.string, "uncategorized"),
    favorite: types.optional(types.boolean, false),
    createdAt: types.optional(types.string, () => new Date().toISOString()),
    updatedAt: types.optional(types.string, () => new Date().toISOString()),
    tags: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    /**
     * Get primary domain from website URL
     */
    get domain(): string {
      try {
        const url = new URL(self.website.startsWith("http") ? self.website : `https://${self.website}`)
        return url.hostname.replace(/^www\./i, "")
      } catch (error) {
        // If not a valid URL, just return the original value
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
        self.notes.toLowerCase().includes(searchTerm) ||
        self.domain.toLowerCase().includes(searchTerm) ||
        self.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      )
    },
  }))
  .actions((self) => ({
    /**
     * Update credential properties
     */
    update(newData: Partial<typeof self>): void {
      Object.assign(self, { ...newData, updatedAt: new Date().toISOString() })
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
    },
  }))

// Factory to create a new credential with defaults
export const createCredentialDefaults = () => {
  return {
    id: generateId(),
    title: "",
    website: "",
    username: "",
    password: "",
    notes: "",
    category: "uncategorized",
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
  }
}

export interface Credential extends Instance<typeof CredentialModel> {}
export interface CredentialSnapshot extends SnapshotOut<typeof CredentialModel> {}