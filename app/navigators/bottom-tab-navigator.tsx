/**
 * This is the bottom tab navigator which provides the main navigation for the app.
 * It includes Home, Settings, and Profile tabs.
 */
import React from "react"
import { View, Platform } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { HomeScreen } from "../screens/home-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { ProfileScreen } from "../screens/profile-screen"
import { colors } from "../theme"
import { AppStackParamList } from "./app-navigator"
import { useRootStore } from "../models"
import { observer } from "mobx-react-lite"

export type TabParamList = {
  Home: undefined
  Settings: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export const BottomTabNavigator = observer(() => {
  const insets = useSafeAreaInsets()
  const { authStore } = useRootStore()
  const isAuthenticated = authStore.authenticated

  // Icon configuration for tab bar
  const getTabBarIcon = (routeName: string, focused: boolean) => {
    let iconName: string
    
    switch (routeName) {
      case "Home":
        iconName = focused ? "key" : "key-outline"
        break
      case "Settings":
        iconName = focused ? "settings" : "settings-outline"
        break
      case "Profile":
        iconName = focused ? "person" : "person-outline"
        break
      default:
        iconName = "help-circle-outline"
    }
    
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={focused ? colors.primary : colors.textDim}
      />
    )
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.separator,
          height: 60 + (Platform.OS === "ios" ? insets.bottom : 0),
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      
      {/* Only show Profile tab if authenticated */}
      {isAuthenticated && <Tab.Screen name="Profile" component={ProfileScreen} />}
    </Tab.Navigator>
  )
})