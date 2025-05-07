/**
 * Color definitions for light and dark themes
 */

/**
 * Base color palette
 */
export const palette = {
  // Primary brand colors
  purple: {
    lightest: '#EBE5FD',
    lighter: '#D1C2FC',
    light: '#B79EFA',
    base: '#9370F5',
    dark: '#7045F2',
    darker: '#5C2BD6',
    darkest: '#461CAE',
  },
  
  // Secondary brand colors
  teal: {
    lightest: '#DEF7F6',
    lighter: '#BFF1ED',
    light: '#91E5DF',
    base: '#5ED2C8',
    dark: '#3DB5AC',
    darker: '#2E8A83',
    darkest: '#1F5D58',
  },
  
  // Accent colors
  coral: {
    lightest: '#FEE9E8',
    lighter: '#FCBFBC',
    light: '#FA9590',
    base: '#F56B63',
    dark: '#E54037',
    darker: '#C2221A',
    darkest: '#921914',
  },
  
  // Neutrals (grayscale)
  gray: {
    white: '#FFFFFF',
    lightest: '#F7F7F7',
    lighter: '#EEEEEE',
    light: '#DDDDDD',
    base: '#CCCCCC',
    medium: '#999999',
    dark: '#666666',
    darker: '#444444',
    darkest: '#222222',
    black: '#000000',
  },
  
  // Semantic colors
  success: {
    lightest: '#E3F9E5',
    lighter: '#C1EAC5',
    light: '#91D5A8',
    base: '#51B96A',
    dark: '#1F9A48',
    darker: '#0A7533',
    darkest: '#05522A',
  },
  
  warning: {
    lightest: '#FFF8E0',
    lighter: '#FEECB0',
    light: '#FFD747',
    base: '#FFBD2E',
    dark: '#E5A100',
    darker: '#AB7800',
    darkest: '#704D00',
  },
  
  error: {
    lightest: '#FFEBEE',
    lighter: '#FFCDD2',
    light: '#EF9A9A',
    base: '#F44336',
    dark: '#D32F2F',
    darker: '#B71C1C',
    darkest: '#7F0000',
  },
  
  info: {
    lightest: '#E3F2FD',
    lighter: '#BBDEFB',
    light: '#90CAF9',
    base: '#2196F3',
    dark: '#1976D2',
    darker: '#0D47A1',
    darkest: '#0A3875',
  },
  
  // Miscellaneous
  transparent: 'transparent',
}

/**
 * Default color theme (light)
 */
export const colors = {
  // Basics
  transparent: palette.transparent,
  
  // Background colors
  background: palette.gray.white,
  backgroundAlt: palette.gray.lightest,
  
  // Surface colors (cards, tiles, etc.)
  surface: palette.gray.white,
  surfaceAlt: palette.gray.lightest,
  
  // Text colors
  text: palette.gray.darkest,
  textDim: palette.gray.dark,
  textLight: palette.gray.medium,
  
  // Border colors
  border: palette.gray.light,
  borderDark: palette.gray.base,
  
  // Primary colors
  primary: palette.purple.base,
  primaryDark: palette.purple.dark,
  primaryLight: palette.purple.light,
  primaryBackground: palette.purple.lightest,
  
  // Secondary colors
  secondary: palette.teal.base,
  secondaryDark: palette.teal.dark,
  secondaryLight: palette.teal.light,
  secondaryBackground: palette.teal.lightest,
  
  // Accent colors
  accent: palette.coral.base,
  accentDark: palette.coral.dark,
  accentLight: palette.coral.light,
  accentBackground: palette.coral.lightest,
  
  // Status colors
  success: palette.success.base,
  successLight: palette.success.light,
  successBackground: palette.success.lightest,
  
  warning: palette.warning.base,
  warningLight: palette.warning.light,
  warningBackground: palette.warning.lightest,
  
  error: palette.error.base,
  errorLight: palette.error.light,
  errorBackground: palette.error.lightest,
  
  info: palette.info.base,
  infoLight: palette.info.light,
  infoBackground: palette.info.lightest,
  
  // Specific UI elements
  card: palette.gray.white,
  separator: palette.gray.lighter,
  placeholder: palette.gray.light,
  backdrop: 'rgba(0, 0, 0, 0.5)',
  shadow: palette.gray.darkest,
  
  // White/black
  white: palette.gray.white,
  black: palette.gray.black,
  
  // Additional UI colors
  navbar: palette.purple.base,
  navbarText: palette.gray.white,
  statusBar: palette.purple.dark,
  tabBar: palette.gray.white,
  tabBarActive: palette.purple.base,
  tabBarInactive: palette.gray.medium,
}

/**
 * Light theme colors
 */
export const lightThemeColors = { ...colors }

/**
 * Dark theme colors
 */
export const darkThemeColors = {
  ...colors,
  
  // Background colors
  background: palette.gray.darkest,
  backgroundAlt: '#1A1A1A',
  
  // Surface colors
  surface: '#2C2C2C',
  surfaceAlt: '#353535',
  
  // Text colors
  text: palette.gray.white,
  textDim: palette.gray.lighter,
  textLight: palette.gray.light,
  
  // Border colors
  border: palette.gray.darker,
  borderDark: palette.gray.dark,
  
  // Primary colors (slightly adjusted for dark theme)
  primary: palette.purple.light,
  primaryDark: palette.purple.base,
  primaryLight: palette.purple.lighter,
  primaryBackground: 'rgba(147, 112, 245, 0.15)',
  
  // Secondary colors
  secondary: palette.teal.light,
  secondaryDark: palette.teal.base,
  secondaryLight: palette.teal.lighter,
  secondaryBackground: 'rgba(94, 210, 200, 0.15)',
  
  // Accent colors
  accent: palette.coral.light,
  accentDark: palette.coral.base,
  accentLight: palette.coral.lighter,
  accentBackground: 'rgba(245, 107, 99, 0.15)',
  
  // Status colors (adjusted for better visibility in dark mode)
  success: palette.success.light,
  successLight: palette.success.lighter,
  successBackground: 'rgba(81, 185, 106, 0.15)',
  
  warning: palette.warning.light,
  warningLight: palette.warning.lighter,
  warningBackground: 'rgba(255, 189, 46, 0.15)',
  
  error: palette.error.light,
  errorLight: palette.error.lighter,
  errorBackground: 'rgba(244, 67, 54, 0.15)',
  
  info: palette.info.light,
  infoLight: palette.info.lighter,
  infoBackground: 'rgba(33, 150, 243, 0.15)',
  
  // Specific UI elements
  card: '#2C2C2C',
  separator: palette.gray.darker,
  placeholder: palette.gray.dark,
  backdrop: 'rgba(0, 0, 0, 0.7)',
  shadow: palette.gray.black,
  
  // Additional UI colors
  navbar: '#2C2C2C',
  navbarText: palette.gray.white,
  statusBar: palette.gray.black,
  tabBar: '#2C2C2C',
  tabBarActive: palette.purple.light,
  tabBarInactive: palette.gray.medium,
}