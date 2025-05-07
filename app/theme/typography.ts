/**
 * Typography definitions for the app
 */
import { Platform } from "react-native"

/**
 * You can find a list of available fonts on both iOS and Android here:
 * https://github.com/react-native-training/react-native-fonts
 */
export const customFontsToLoad = {
  "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
}

const fonts = {
  poppins: {
    light: "Poppins-Light",
    normal: "Poppins-Regular",
    medium: "Poppins-Medium",
    semiBold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: Platform.select({
    ios: {
      light: {
        fontFamily: fonts.poppins.light,
        fontWeight: "normal",
      },
      normal: {
        fontFamily: fonts.poppins.normal,
        fontWeight: "normal",
      },
      medium: {
        fontFamily: fonts.poppins.medium,
        fontWeight: "normal",
      },
      semiBold: {
        fontFamily: fonts.poppins.semiBold,
        fontWeight: "normal",
      },
      bold: {
        fontFamily: fonts.poppins.bold,
        fontWeight: "normal",
      },
    },
    android: {
      light: {
        fontFamily: fonts.poppins.light,
        fontWeight: "normal",
      },
      normal: {
        fontFamily: fonts.poppins.normal,
        fontWeight: "normal",
      },
      medium: {
        fontFamily: fonts.poppins.medium,
        fontWeight: "normal",
      },
      semiBold: {
        fontFamily: fonts.poppins.semiBold,
        fontWeight: "normal",
      },
      bold: {
        fontFamily: fonts.poppins.bold,
        fontWeight: "normal",
      },
    },
  }),
  /**
   * An alternate font. Used for emphasis.
   */
  secondary: Platform.select({
    ios: {
      normal: {
        fontFamily: fonts.helveticaNeue.normal,
        fontWeight: "normal",
      },
      medium: {
        fontFamily: fonts.helveticaNeue.medium,
        fontWeight: "normal",
      },
      light: {
        fontFamily: fonts.helveticaNeue.light,
        fontWeight: "normal",
      },
      thin: {
        fontFamily: fonts.helveticaNeue.thin,
        fontWeight: "normal",
      },
    },
    android: {
      normal: {
        fontFamily: fonts.sansSerif.normal,
        fontWeight: "normal",
      },
      medium: {
        fontFamily: fonts.sansSerif.medium,
        fontWeight: "normal",
      },
      light: {
        fontFamily: fonts.sansSerif.light,
        fontWeight: "normal",
      },
      thin: {
        fontFamily: fonts.sansSerif.thin,
        fontWeight: "normal",
      },
    },
  }),
  /**
   * Monospace font.
   */
  code: Platform.select({
    ios: {
      normal: {
        fontFamily: fonts.courier.normal,
        fontWeight: "normal",
      },
    },
    android: {
      normal: {
        fontFamily: fonts.monospace.normal,
        fontWeight: "normal",
      },
    },
  }),
}
