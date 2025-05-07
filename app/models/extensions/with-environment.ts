/**
 * Extension to add environment support to models
 */
import { types } from "mobx-state-tree"
import { Environment } from "../../services/environment"

/**
 * Adds an environment property to the model
 */
export const withEnvironment = types
  .model("withEnvironment")
  .props({
    // Avoid making this required for easier testing
    environment: types.optional(types.frozen<Environment>(), {} as Environment),
  })
  .actions((self) => ({
    /**
     * Set the environment
     */
    setEnvironment(value: Environment) {
      if (value) {
        self.environment = value
      }
    },
  }))