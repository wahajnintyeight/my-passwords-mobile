/**
 * Theme index file that exports all theme resources
 */
import { colors, lightThemeColors, darkThemeColors, palette } from './colors'
import { spacing, size } from './spacing'
import { fonts, fontWeights, fontSize, lineHeight, textVariants } from './typography'

/**
 * Main theme object that combines all theme resources
 */
export const theme = {
  colors,
  spacing,
  size,
  fonts,
  fontWeights,
  fontSize,
  lineHeight,
  textVariants,
}

/**
 * Light theme version
 */
export const lightTheme = {
  ...theme,
  colors: {
    ...lightThemeColors,
    transparent: 'transparent',
  },
  isDark: false,
}

/**
 * Dark theme version
 */
export const darkTheme = {
  ...theme,
  colors: {
    ...darkThemeColors,
    transparent: 'transparent',
  },
  isDark: true,
}

export {
  colors,
  spacing,
  size,
  fonts,
  fontWeights,
  fontSize,
  lineHeight,
  textVariants,
  palette,
  lightThemeColors,
  darkThemeColors
}

export default theme