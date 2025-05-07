/**
 * The app navigator is the main navigation container that defines the navigation structure.
 * It wraps multiple navigators and screens - in this case, a stack navigator that contains
 * the splash screen initially, and then transitions to the bottom tab navigator.
 */
import React from "react"
import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BottomTabNavigator } from "./bottom-tab-navigator"
import { colors } from "../theme"
import { SplashScreen } from "../screens/splash-screen"
import { CredentialDetailScreen } from "../screens/credential-detail-screen"
import { AddCredentialScreen } from "../screens/add-credential-screen"
import { ScanScreen } from "../screens/scan-screen"
import { ImportExportScreen } from "../screens/import-export-screen"

// Define the parameter list for the stack navigator
export type AppStackParamList = {
  Splash: undefined
  Main: undefined
  CredentialDetail: { id: string }
  AddCredential: undefined
  Scan: undefined
  ImportExport: undefined
}

// Create the stack navigator
const Stack = createNativeStackNavigator<AppStackParamList>()

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export function AppNavigator(props: NavigationProps) {
  // Use light/dark specific theme
  const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  }

  return (
    <NavigationContainer
      theme={MyTheme}
      {...props}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background,
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
            title: "Credential Details",
          }}
        />
        <Stack.Screen
          name="AddCredential"
          component={AddCredentialScreen}
          options={{
            headerShown: true,
            title: "Add Credential",
          }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            headerShown: true,
            title: "Scan Login Fields",
          }}
        />
        <Stack.Screen
          name="ImportExport"
          component={ImportExportScreen}
          options={{
            headerShown: true,
            title: "Import & Export",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}