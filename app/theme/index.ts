/**
 * Central export file for theme configuration
 */
import { colors, lightThemeColors, darkThemeColors, palette } from './colors'
import { spacing } from './spacing'

/**
 * Typography styles for the app
 */
export const typography = {
  /**
   * Font families
   */
  fonts: {
    primary: 'System',
    secondary: 'System',
    code: 'Courier',
  },
  
  /**
   * Font weights
   */
  weights: {
    light: '300',
    normal: '400', 
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  
  /**
   * Font sizes
   */
  sizes: {
    tiny: 10,
    xxs: 12,
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 36,
    huge: 48,
  },
  
  /**
   * Line heights (multiplier of font size)
   */
  lineHeights: {
    compact: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  /**
   * Letter spacing
   */
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
  
  /**
   * Predefined text styles
   */
  styles: {
    h1: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.35,
    },
    h6: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.35,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.4,
      textTransform: 'uppercase',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.4,
    },
  },
}

/**
 * Default theme
 */
export const theme = {
  colors,
  spacing,
  typography,
}

/**
 * Light theme variation
 */
export const lightTheme = {
  ...theme,
  colors: lightThemeColors,
}

/**
 * Dark theme variation
 */
export const darkTheme = {
  ...theme,
  colors: darkThemeColors,
}

/**
 * Export all theme components
 */
export { colors, lightThemeColors, darkThemeColors, spacing, palette }