/**
 * The app navigator is the main navigation container that defines the navigation structure.
 * It wraps multiple navigators and screens - in this case, a stack navigator that contains
 * the splash screen initially, and then transitions to the bottom tab navigator.
 */
import React from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BottomTabNavigator } from "./bottom-tab-navigator"
import { SplashScreen } from "../screens"
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

  const MyTheme: Theme = {
    dark: colorScheme === "dark",
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.notification,
    },
  }

  return (
    <NavigationContainer theme={MyTheme} {...props}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
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
            headerBackTitle: "Back"
          }}
        />
        <Stack.Screen 
          name="AddCredential" 
          component={AddCredentialScreen} 
          options={{ 
            headerShown: true, 
            title: "Add Credential",
            headerBackTitle: "Back"
          }}
        />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen} 
          options={{ 
            headerShown: true, 
            title: "Scan Credentials",
            headerBackTitle: "Back"
          }}
        />
        <Stack.Screen 
          name="ImportExport" 
          component={ImportExportScreen} 
          options={{ 
            headerShown: true, 
            title: "Import/Export",
            headerBackTitle: "Back"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
