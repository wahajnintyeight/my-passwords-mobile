/**
 * The splash screen that displays when the app first launches.
 * Shows the "Get Started" message and login/skip options.
 */
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { colors, spacing } from "../theme"
import { observer } from "mobx-react-lite"
import { useRootStore } from "../models"

export const SplashScreen: React.FC<NativeStackScreenProps<AppStackParamList, "Splash">> = observer(
  ({ navigation }) => {
    const { authStore } = useRootStore()

    const handleGoogleLogin = async () => {
      const success = await authStore.loginWithGoogle()
      if (success) {
        navigation.replace("Main")
      }
    }

    const handleSkip = () => {
      authStore.setOfflineMode(true)
      navigation.replace("Main")
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🔐</Text>
            <Text style={styles.appName}>SecureVault</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>Secure Your Passwords</Text>
            <Text style={styles.subtitle}>
              Store, manage, and secure all your passwords in one place with military-grade encryption.
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGoogleLogin}>
              <Text style={styles.primaryButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={styles.secondaryButtonText}>Skip (Offline Mode)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.large,
    paddingTop: spacing.massive,
    paddingBottom: spacing.massive,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.large,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.medium,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: spacing.medium,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.medium,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    textAlign: "center",
    marginBottom: spacing.large,
  },
  buttonsContainer: {
    marginTop: spacing.extraLarge,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
})