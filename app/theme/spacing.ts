/**
 * Spacing values for consistent layout
 */

/**
 * Base unit for spacing
 */
const UNIT = 8

/**
 * Default spacing values
 */
export const spacing = {
  // Base unit
  unit: UNIT,
  
  // Absolute spacing values
  micro: UNIT * 0.25, // 2
  tiny: UNIT * 0.5,   // 4
  xxs: UNIT * 0.75,   // 6
  xs: UNIT,           // 8
  sm: UNIT * 1.5,     // 12
  md: UNIT * 2,       // 16
  lg: UNIT * 3,       // 24
  xl: UNIT * 4,       // 32
  xxl: UNIT * 6,      // 48
  
  // Screen specific spacing
  screenHorizontal: UNIT * 2,
  screenTop: UNIT * 2,
  screenBottom: UNIT * 2,
  
  // Card padding
  cardPadding: UNIT * 2,
  
  // Input fields
  inputHeight: UNIT * 6,
  inputPadding: UNIT * 1.5,
  
  // Button sizes
  buttonHeight: UNIT * 6,
  buttonPaddingHorizontal: UNIT * 2,
  buttonPaddingVertical: UNIT * 1.5,
  buttonBorderRadius: UNIT,
  
  // Icon button sizes
  iconButtonSmall: UNIT * 4,
  iconButtonMedium: UNIT * 5,
  iconButtonLarge: UNIT * 6,
  
  // Avatar sizes
  avatarSmall: UNIT * 4,
  avatarMedium: UNIT * 6,
  avatarLarge: UNIT * 10,
  
  // Tab bar
  tabBarHeight: UNIT * 7,
  
  // Z-index levels
  zIndex: {
    base: 1,
    card: 10,
    dialog: 20,
    popover: 30,
    overlay: 40,
    modal: 50,
    toast: 60,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 1000, // Large value for fully rounded elements
    circular: 10000, // Even larger value for circular elements
  },
  
  // Shadows
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 6,
    },
  },
}

// Additional size multipliers for components
export const size = {
  xxs: 0.25,
  xs: 0.5,
  sm: 0.75,
  md: 1,
  lg: 1.5,
  xl: 2,
  xxl: 3,
  
  // Legacy size definitions for backward compatibility
  small: 0.75,
  medium: 1,
  large: 1.5,
  extraLarge: 2,
}