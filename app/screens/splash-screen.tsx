/**
 * The splash screen that displays when the app first launches.
 * Shows the "Get Started" message and login/skip options.
 */
import React, { FC, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { colors, spacing, typography } from "../theme"
import { Feather } from "@expo/vector-icons"
import { useStores } from "../models"

export const SplashScreen: FC<NativeStackScreenProps<AppStackParamList, "Splash">> = ({
  navigation,
}) => {
  const { authStore } = useStores()

  useEffect(() => {
    // If user is already authenticated, navigate directly to Main
    if (authStore.isAuthenticated) {
      navigation.replace("Main")
    }
  }, [authStore.isAuthenticated])

  const handleGoogleLogin = async () => {
    try {
      await authStore.loginWithGoogle()
      navigation.replace("Main")
    } catch (error) {
      console.error("Google login failed:", error)
    }
  }

  const handleSkip = () => {
    authStore.setOfflineMode(true)
    navigation.replace("Main")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Feather name="lock" size={80} color={colors.primary} />
          <Text style={styles.appTitle}>SecureVault</Text>
          <Text style={styles.appSubtitle}>Password Manager</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.welcomeText}>Get Started</Text>
          <Text style={styles.descriptionText}>
            Keep your passwords secure and access them anywhere, anytime. Sign in to sync across devices
            or use offline.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Feather name="mail" size={20} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.googleButtonText}>Continue with Gmail</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now (Offline Mode)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityContainer}>
          <Feather name="shield" size={16} color={colors.textDim} />
          <Text style={styles.securityText}>End-to-end encryption</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.large,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: spacing.massive,
  },
  appTitle: {
    ...typography.primary.bold,
    fontSize: 32,
    color: colors.text,
    marginTop: spacing.medium,
  },
  appSubtitle: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.textDim,
    marginTop: spacing.tiny,
  },
  messageContainer: {
    marginTop: spacing.massive,
    alignItems: "center",
  },
  welcomeText: {
    ...typography.primary.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  descriptionText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.textDim,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: spacing.massive,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.medium,
  },
  buttonIcon: {
    marginRight: spacing.small,
  },
  googleButtonText: {
    ...typography.primary.semiBold,
    color: colors.white,
    fontSize: 16,
  },
  skipButton: {
    padding: spacing.medium,
    alignItems: "center",
  },
  skipButtonText: {
    ...typography.primary.medium,
    color: colors.textDim,
    fontSize: 16,
  },
  securityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.large,
  },
  securityText: {
    ...typography.primary.medium,
    color: colors.textDim,
    fontSize: 14,
    marginLeft: spacing.tiny,
  },
})
