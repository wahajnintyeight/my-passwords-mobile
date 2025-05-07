/**
 * Typography styles for the app
 */
import { Platform } from 'react-native'

/**
 * Font family definitions
 */
export const fonts = {
  // Using system fonts for best performance and native feel
  primary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
  }),
  
  secondary: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, serif'
  }),
  
  code: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    web: 'Consolas, monospace'
  }),
}

/**
 * Font weight definitions
 */
export const fontWeights = {
  thin: '100' as const,
  extralight: '200' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
}

/**
 * Font sizes by usage
 */
export const fontSize = {
  // Size scale
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Semantic sizes
  caption: 12,
  button: 16,
  body: 16,
  bodySmall: 14,
  title: 18,
  headline: 24,
  subheading: 20,
  display: 32,
}

/**
 * Line height multipliers
 */
export const lineHeight = {
  xs: 1.2,
  sm: 1.3,
  md: 1.5,
  lg: 1.7,
  xl: 1.8,
  xxl: 2,
}

/**
 * Text styles for consistent typography
 */
export const textVariants = {
  defaults: {
    fontFamily: fonts.primary,
    fontSize: fontSize.body,
    fontWeight: fontWeights.regular,
    color: 'text',
  },
  
  // Display and heading styles
  display: {
    fontSize: fontSize.display,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.display * lineHeight.xs,
  },
  
  heading1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.xxxl * lineHeight.xs,
  },
  
  heading2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.xxl * lineHeight.xs,
  },
  
  heading3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.xl * lineHeight.sm,
  },
  
  heading4: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.lg * lineHeight.sm,
  },
  
  // Body text styles
  body: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.md,
  },
  
  bodyBold: {
    fontSize: fontSize.body,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.body * lineHeight.md,
  },
  
  bodySmall: {
    fontSize: fontSize.bodySmall,
    lineHeight: fontSize.bodySmall * lineHeight.md,
  },
  
  // Other text styles
  caption: {
    fontSize: fontSize.caption,
    lineHeight: fontSize.caption * lineHeight.md,
  },
  
  button: {
    fontSize: fontSize.button,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.button * lineHeight.sm,
    textTransform: 'none' as const, // 'uppercase' for Material style
  },
  
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.sm,
    textTransform: 'none' as const,
  },
  
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.sm,
  },
  
  link: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.md,
    textDecorationLine: 'underline' as const,
  },
  
  // Tab text styles
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.xs,
  },
  
  // Toolbar text styles
  toolbar: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.lg * lineHeight.xs,
  },
  
  // Text input styles
  input: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.md,
  },
}