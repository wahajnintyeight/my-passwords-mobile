/**
 * Defines the color palette for the app
 */
import { Platform } from "react-native"

// Semantic names for colors to be used throughout the app
export const colors = {
  // Base colors
  transparent: "rgba(0, 0, 0, 0)",
  white: "#FFFFFF",
  black: "#000000",
  
  // Primary brand colors
  primary: "#2563EB", // Blue
  primaryDark: "#1E40AF",
  primaryLight: "#93C5FD",
  
  // Secondary brand colors
  secondary: "#4F46E5", // Indigo
  secondaryDark: "#4338CA",
  secondaryLight: "#C7D2FE",
  
  // Accent colors
  accent: "#10B981", // Emerald
  accentDark: "#059669",
  accentLight: "#A7F3D0",
  
  // Status colors
  success: "#10B981", // Green
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Red
  info: "#3B82F6", // Blue
  
  // Background colors
  background: "#F9FAFB", // Light gray background
  card: "#FFFFFF",
  lighterGrey: "#F3F4F6",
  lightGrey: "#E5E7EB",
  
  // Text colors
  text: "#111827", // Almost black
  textDim: "#6B7280", // Medium gray
  textLight: "#9CA3AF", // Lighter gray
  placeholder: "#D1D5DB",
  
  // Border and separator colors
  separator: "#E5E7EB",
  border: "#D1D5DB",
  
  // Shadow color
  shadowColor: Platform.select({
    ios: "rgba(0, 0, 0, 0.1)",
    android: "rgba(0, 0, 0, 0.2)",
  }),
}