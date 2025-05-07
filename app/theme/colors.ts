/**
 * Color palette for the app
 */

/**
 * Primary palette - main brand colors
 */
export const palette = {
  // Primary brand colors
  primary: "#4A6FA5",
  primaryDark: "#395782",
  primaryLight: "#6989B9",
  primaryLighter: "#EBF0F9",
  
  // Secondary & accent colors
  secondary: "#FF6B6B",
  secondaryDark: "#E05959",
  secondaryLight: "#FF8A8A",
  
  // Success, warning, error colors
  success: "#4CAF50",
  successDark: "#388E3C",
  successLight: "#81C784",
  
  warning: "#FFC107",
  warningDark: "#FFA000",
  warningLight: "#FFD54F",
  
  error: "#F44336",
  errorDark: "#D32F2F",
  errorLight: "#E57373",
  
  // Neutral colors
  neutral100: "#FFFFFF",
  neutral200: "#F7F9FC",
  neutral300: "#EDF1F7",
  neutral400: "#C5CEE0",
  neutral500: "#8F9BB3",
  neutral600: "#55627C",
  neutral700: "#2E3A59",
  neutral800: "#1A2138",
  neutral900: "#101426",
}

/**
 * Semantic colors for light theme
 */
export const lightThemeColors = {
  // Background colors
  background: palette.neutral100,
  backgroundAlt: palette.neutral200,
  card: palette.neutral100,
  surface: palette.neutral100,
  surfaceAlt: palette.neutral200,
  
  // Text colors
  text: palette.neutral800,
  textDim: palette.neutral600,
  textLight: palette.neutral500,
  textInverted: palette.neutral100,
  link: palette.primary,
  
  // Border colors
  border: palette.neutral300,
  borderLight: palette.neutral200,
  divider: palette.neutral300,
  
  // Interactive elements
  focus: palette.primaryLight,
  hover: palette.primaryLighter,
  pressed: palette.primaryDark,
  disabled: palette.neutral400,
  
  // Status colors
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.primary,
  
  // Brand colors
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  primaryLight: palette.primaryLight,
  secondary: palette.secondary,
  
  // Component specific
  tabBar: palette.neutral100,
  tabBarInactive: palette.neutral500,
  tabBarActive: palette.primary,
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
  backdrop: "rgba(0, 0, 0, 0.3)",
  shadow: "rgba(0, 0, 0, 0.1)",
}

/**
 * Semantic colors for dark theme
 */
export const darkThemeColors = {
  // Background colors
  background: palette.neutral900,
  backgroundAlt: palette.neutral800,
  card: palette.neutral800,
  surface: palette.neutral800,
  surfaceAlt: palette.neutral700,
  
  // Text colors
  text: palette.neutral100,
  textDim: palette.neutral300,
  textLight: palette.neutral400,
  textInverted: palette.neutral800,
  link: palette.primaryLight,
  
  // Border colors
  border: palette.neutral700,
  borderLight: palette.neutral600,
  divider: palette.neutral700,
  
  // Interactive elements
  focus: palette.primaryLight,
  hover: "rgba(74, 111, 165, 0.2)", // primary with opacity
  pressed: palette.primaryDark,
  disabled: palette.neutral600,
  
  // Status colors
  success: palette.successLight,
  error: palette.errorLight,
  warning: palette.warningLight,
  info: palette.primaryLight,
  
  // Brand colors
  primary: palette.primaryLight,
  primaryDark: palette.primary,
  primaryLight: palette.primaryLight,
  secondary: palette.secondaryLight,
  
  // Component specific
  tabBar: palette.neutral800,
  tabBarInactive: palette.neutral500,
  tabBarActive: palette.primaryLight,
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.7)",
  backdrop: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.3)",
}

/**
 * Default theme colors (light)
 */
export const colors = {
  ...lightThemeColors,
  
  // Colors specifically needed for React Navigation
  transparent: "transparent",
  background: lightThemeColors.background,
  card: lightThemeColors.card,
  text: lightThemeColors.text,
  border: lightThemeColors.border,
  notification: lightThemeColors.secondary,
}