/**
 * Spacing definitions for consistent padding and margins
 */

/**
 * Base unit for all spacing
 */
export const unit = 8

/**
 * Spacing values for use in padding, margin, etc.
 */
export const spacing = {
  // Base unit
  unit,
  
  // Smaller increments
  micro: unit / 4, // 2
  tiny: unit / 2, // 4
  xxs: unit * 0.75, // 6
  
  // Standard increments
  xs: unit, // 8
  sm: unit * 1.5, // 12
  md: unit * 2, // 16
  lg: unit * 3, // 24
  xl: unit * 4, // 32
  xxl: unit * 6, // 48
  
  // Screen edge padding
  screenHorizontal: unit * 2, // 16
  screenTop: unit * 2, // 16
  screenBottom: unit * 2, // 16
  
  // Card and component padding
  cardPadding: unit * 2, // 16
  cardGap: unit, // 8
  
  // Grid spacing
  gridGutter: unit, // 8
  gridMargin: unit * 2, // 16
  
  // Icon sizing and spacing
  iconSize: {
    xs: unit * 1.5, // 12
    sm: unit * 2, // 16
    md: unit * 3, // 24
    lg: unit * 4, // 32
    xl: unit * 6, // 48
  },
  
  // Button sizing
  buttonHeight: {
    xs: unit * 3, // 24
    sm: unit * 4, // 32
    md: unit * 5, // 40
    lg: unit * 6, // 48
  },
  
  // Form elements
  inputHeight: unit * 5.5, // 44
  inputPadding: unit * 1.5, // 12
  inputBorderWidth: 1,
  inputBorderRadius: unit, // 8
  
  // Border radius
  borderRadius: {
    xs: unit / 2, // 4
    sm: unit, // 8
    md: unit * 1.5, // 12
    lg: unit * 2, // 16
    xl: unit * 3, // 24
    round: 9999,
  },
  
  // Z-index values
  zIndex: {
    base: 1,
    card: 10,
    modal: 100,
    overlay: 1000,
    toast: 2000,
    tooltip: 3000,
  },
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}