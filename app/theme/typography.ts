/**
 * Typography definitions for consistent text styling
 */

import { Platform } from 'react-native'

/**
 * Font family definitions
 */
export const fonts = {
  /**
   * The primary font used for most text
   */
  primary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System'
  }),
  
  /**
   * Alternative font for emphasis or branding
   */
  secondary: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif'
  }),
  
  /**
   * Monospace font for displaying code or fixed-width content
   */
  code: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace'
  }),
}

/**
 * Font sizes used throughout the app
 */
export const fontSizes = {
  tiny: 10,
  xxs: 11,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  
  // Specific use cases
  heading1: 32,
  heading2: 28,
  heading3: 24,
  heading4: 20,
  heading5: 18,
  
  caption: 12,
  button: 16,
  
  // For specific components
  tabLabel: 10,
  inputText: 16,
  navbar: 18,
  dialog: 16,
}

/**
 * Line height multipliers
 */
export const lineHeights = {
  tighter: 1.1,
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
}

/**
 * Font weights
 */
export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
}

/**
 * Pre-defined text styles
 */
export const textVariants = {
  // Headings
  h1: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.heading1 * lineHeights.tight,
    letterSpacing: -0.5,
  },
  
  h2: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.heading2 * lineHeights.tight,
    letterSpacing: -0.4,
  },
  
  h3: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading3,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.heading3 * lineHeights.tight,
    letterSpacing: -0.3,
  },
  
  h4: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading4,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.heading4 * lineHeights.tight,
    letterSpacing: -0.2,
  },
  
  h5: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading5,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.heading5 * lineHeights.tight,
    letterSpacing: -0.1,
  },
  
  // Body text
  body1: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  
  body2: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  
  body3: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  
  // UI Elements
  caption: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.caption * lineHeights.normal,
  },
  
  button: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.button,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.button * lineHeights.tight,
    letterSpacing: 0.3,
  },
  
  label: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.tight,
  },
  
  tabLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.tabLabel,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.tabLabel * lineHeights.tight,
  },
  
  // Special cases
  code: {
    fontFamily: fonts.code,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  
  formLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.tight,
  },
  
  formInput: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.inputText,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.inputText * lineHeights.tight,
  },
  
  formError: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.xs * lineHeights.tight,
  },
}