/**
 * Typography definitions for the app
 */
import { Platform } from "react-native"

// Define the standard font family based on platform
const baseFontFamily = Platform.select({
  ios: {
    light: "System",
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },
  android: {
    light: "sans-serif-light",
    regular: "sans-serif",
    medium: "sans-serif-medium",
    semiBold: "sans-serif-medium",
    bold: "sans-serif-bold",
  },
  default: {
    light: "System",
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },
})

// System-specific font weights
const fontWeights = {
  light: Platform.select({
    ios: "300",
    android: "300",
    default: "300",
  }),
  regular: Platform.select({
    ios: "400",
    android: "400",
    default: "400",
  }),
  medium: Platform.select({
    ios: "500",
    android: "500",
    default: "500",
  }),
  semiBold: Platform.select({
    ios: "600",
    android: "600",
    default: "600",
  }),
  bold: Platform.select({
    ios: "700",
    android: "700",
    default: "700",
  }),
}

export const typography = {
  /**
   * Font families keyed by name
   */
  fonts: baseFontFamily,

  /**
   * Font weights
   */
  weights: fontWeights,

  /**
   * The primary font to use
   */
  primaryFont: baseFontFamily.regular,

  /**
   * Text presets
   */
  presets: {
    // Display
    displayLarge: {
      fontFamily: baseFontFamily.bold,
      fontWeight: fontWeights.bold,
      fontSize: 34,
      lineHeight: 40,
      letterSpacing: 0.25,
    },
    displayMedium: {
      fontFamily: baseFontFamily.bold,
      fontWeight: fontWeights.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: 0.25,
    },
    displaySmall: {
      fontFamily: baseFontFamily.bold,
      fontWeight: fontWeights.bold,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: 0,
    },

    // Headline
    headlineLarge: {
      fontFamily: baseFontFamily.semiBold,
      fontWeight: fontWeights.semiBold,
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontFamily: baseFontFamily.semiBold,
      fontWeight: fontWeights.semiBold,
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontFamily: baseFontFamily.semiBold,
      fontWeight: fontWeights.semiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Title
    titleLarge: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0,
    },
    titleMedium: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },

    // Body
    bodyLarge: {
      fontFamily: baseFontFamily.regular,
      fontWeight: fontWeights.regular,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    bodyMedium: {
      fontFamily: baseFontFamily.regular,
      fontWeight: fontWeights.regular,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: baseFontFamily.regular,
      fontWeight: fontWeights.regular,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },

    // Label
    labelLarge: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: baseFontFamily.medium,
      fontWeight: fontWeights.medium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
}