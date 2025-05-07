/**
 * The splash screen that displays when the app first launches.
 * Shows the "Get Started" message and login/skip options.
 */
import React, { FC, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  ImageBackground,
  StatusBar,
} from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackParamList } from "../navigators/app-navigator"
import { colors, spacing, typography } from "../theme"
import { useRootStore } from "../models"

export const SplashScreen: React.FC<NativeStackScreenProps<AppStackParamList, "Splash">> = observer(
  ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const { authStore } = useRootStore()
    const [loading, setLoading] = useState(false)

    // Automatically navigate to Main screen if already authenticated
    useEffect(() => {
      const checkAuth = async () => {
        await authStore.initialize()
        if (authStore.authenticated) {
          navigation.replace("Main")
        }
      }

      checkAuth()
    }, [])

    // Handle login with Google
    const handleGoogleLogin = async () => {
      setLoading(true)
      try {
        const success = await authStore.loginWithGoogle()
        if (success) {
          navigation.replace("Main")
        }
      } catch (error) {
        console.error("Login error:", error)
      } finally {
        setLoading(false)
      }
    }

    // Skip login and use offline mode
    const handleSkipLogin = () => {
      authStore.setOfflineMode(true)
      navigation.replace("Main")
    }

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        
        {/* Main content */}
        <View style={styles.content}>
          {/* Logo and title */}
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={80} color={colors.primary} />
            <Text style={styles.title}>SecureVault</Text>
            <Text style={styles.subtitle}>Password Manager</Text>
          </View>

          {/* Description text */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Safely store and manage your passwords with military-grade encryption
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  <Ionicons name="logo-google" size={24} color={colors.white} style={styles.buttonIcon} />
                  <Text style={styles.primaryButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleSkipLogin}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Use Offline Mode</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        {/* Footer text */}
        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing.md }]}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.presets.displayMedium,
    color: colors.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.presets.titleMedium,
    color: colors.textDim,
    marginTop: spacing.xs,
  },
  descriptionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  description: {
    ...typography.presets.bodyLarge,
    color: colors.textDim,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.small,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: spacing.md,
    height: spacing.buttonHeight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    ...typography.presets.labelLarge,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: spacing.borderRadius.small,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    height: spacing.buttonHeight,
  },
  secondaryButtonText: {
    ...typography.presets.labelLarge,
    color: colors.text,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  footerText: {
    ...typography.presets.bodySmall,
    color: colors.textLight,
    textAlign: "center",
  },
})