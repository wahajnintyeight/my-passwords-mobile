/**
 * Welcome to the main entry point of the app. In this file, we set up our root
 * component and initialize the app with the required providers.
 */
import React, { useEffect } from "react"
import { LogBox } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Linking from "expo-linking"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import { AppNavigator } from "./navigators"
import { ErrorBoundary } from "./screens/error/error-boundary"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { useInitialRootStore } from "./models/helpers/use-initial-root-store"
import { customFontsToLoad } from "./theme"
import Config from "./config"

// Ignore log notifications by message
LogBox.ignoreLogs(["Warning: ..."])

// Configure deep linking
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Home: "home",
    Settings: "settings",
    Profile: "profile",
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    rootStore,
    initialNavigationState,
    onNavigationStateChange,
    isRestored,
  } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    // If your initialization scripts are long-running, you can move them here.
    return () => hideSplashScreen()
  })

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  // Before we show the app, we have to wait for our state to be ready and for the fonts to load.
  if (!rootStore || !isRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  // Otherwise, we're good to render the app!
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootStoreProvider value={rootStore}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </RootStoreProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
