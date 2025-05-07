/**
 * The app navigator is the main navigation container that defines the navigation structure.
 * It wraps multiple navigators and screens - in this case, a stack navigator that contains
 * the splash screen initially, and then transitions to the bottom tab navigator.
 */
import React from "react"
import { useColorScheme, Platform } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { SplashScreen } from "../screens/splash-screen"
import { BottomTabNavigator } from "./bottom-tab-navigator"
import { CredentialDetailScreen } from "../screens/credential-detail-screen"
import { AddCredentialScreen } from "../screens/add-credential-screen"
import { ScanScreen } from "../screens/scan-screen"
import { ImportExportScreen } from "../screens/import-export-screen"
import { colors } from "../theme"

export type AppStackParamList = {
  Splash: undefined
  Main: undefined
  CredentialDetail: { id: string }
  AddCredential: undefined
  Scan: undefined
  ImportExport: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  // Customize the theme for our app
  const MyTheme: Theme = {
    dark: colorScheme === "dark",
    colors: {
      ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colorScheme === "dark" ? "#121212" : colors.background,
      card: colorScheme === "dark" ? "#1E1E1E" : colors.white,
      text: colorScheme === "dark" ? colors.white : colors.text,
      border: colorScheme === "dark" ? "#2C2C2C" : colors.border,
      notification: colors.error,
    },
  }

  return (
    <NavigationContainer theme={MyTheme} {...props}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen
          name="CredentialDetail"
          component={CredentialDetailScreen}
          options={{
            headerShown: true,
            headerTitle: "Password Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="AddCredential"
          component={AddCredentialScreen}
          options={{
            headerShown: true,
            headerTitle: "Add Password",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            headerShown: true,
            headerTitle: "Scan Login",
            headerBackTitle: "Back",
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="ImportExport"
          component={ImportExportScreen}
          options={{
            headerShown: true,
            headerTitle: "Import & Export",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}