/**
 * Profile screen to show user account information and sync status
 */
import React, { FC } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { SafeAreaView } from "react-native-safe-area-context"

export const ProfileScreen: FC<NativeStackScreenProps<AppStackParamList, "Main">> = observer(
  ({ navigation }) => {
    const { authStore, credentialStore } = useStores()

    const handleConnectGmail = async () => {
      try {
        if (!authStore.isOfflineMode) {
          Alert.alert("Already Connected", "You are already connected with your Google account.")
          return
        }

        // Navigate to splash screen for login
        navigation.navigate("Splash")
      } catch (error) {
        Alert.alert("Connection Failed", "Could not connect to Google. Please try again later.")
      }
    }

    const handleSyncNow = async () => {
      try {
        if (authStore.isOfflineMode) {
          Alert.alert(
            "Sync Unavailable",
            "You are currently in offline mode. Please connect with Gmail to enable syncing.",
            [{ text: "OK" }]
          )
          return
        }

        // Try to sync
        await credentialStore.syncCredentials()
        Alert.alert("Success", "Your passwords have been synchronized with the cloud.")
      } catch (error) {
        Alert.alert("Sync Failed", "Could not synchronize your passwords. Please try again later.")
      }
    }

    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {authStore.isOfflineMode ? (
                <View style={styles.offlineAvatar}>
                  <Feather name="user" size={40} color={colors.textDim} />
                </View>
              ) : (
                <Image
                  source={{ uri: authStore.userProfilePic || "https://via.placeholder.com/100" }}
                  style={styles.avatar}
                />
              )}
            </View>

            <Text style={styles.profileName}>
              {authStore.isOfflineMode ? "Offline User" : authStore.userName || "User"}
            </Text>

            <View style={styles.statusContainer}>
              <Feather
                name={authStore.isOfflineMode ? "wifi-off" : "cloud"}
                size={16}
                color={authStore.isOfflineMode ? colors.error : colors.success}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {authStore.isOfflineMode ? "Offline Mode" : "Cloud Sync Enabled"}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{credentialStore.credentials.length}</Text>
              <Text style={styles.statLabel}>Passwords</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {credentialStore.lastSyncDate ? "Yes" : "No"}
              </Text>
              <Text style={styles.statLabel}>Synced</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {credentialStore.lastSyncDate
                  ? new Date(credentialStore.lastSyncDate).toLocaleDateString()
                  : "Never"}
              </Text>
              <Text style={styles.statLabel}>Last Sync</Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleSyncNow}
            >
              <Feather name="refresh-cw" size={18} color={colors.white} style={styles.actionIcon} />
              <Text style={styles.primaryButtonText}>Sync Now</Text>
            </TouchableOpacity>

            {authStore.isOfflineMode && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleConnectGmail}
              >
                <Feather name="mail" size={18} color={colors.primary} style={styles.actionIcon} />
                <Text style={styles.secondaryButtonText}>Connect with Gmail</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => navigation.navigate("ImportExport")}
            >
              <Feather
                name="upload"
                size={18}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={styles.secondaryButtonText}>Import/Export</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securitySection}>
            <Text style={styles.sectionTitle}>Security Information</Text>

            <View style={styles.securityItem}>
              <Feather name="shield" size={18} color={colors.success} style={styles.securityIcon} />
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>End-to-End Encryption</Text>
                <Text style={styles.securityDescription}>
                  Your passwords are encrypted and can only be accessed by you
                </Text>
              </View>
            </View>

            <View style={styles.securityItem}>
              <Feather
                name="smartphone"
                size={18}
                color={colors.success}
                style={styles.securityIcon}
              />
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Offline Access</Text>
                <Text style={styles.securityDescription}>
                  Access your passwords anytime, even without internet
                </Text>
              </View>
            </View>

            <View style={styles.securityItem}>
              <Feather name="eye-off" size={18} color={colors.success} style={styles.securityIcon} />
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Private Browsing</Text>
                <Text style={styles.securityDescription}>
                  Your browsing data is never stored or tracked
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.large,
    paddingBottom: spacing.large,
    backgroundColor: colors.card,
  },
  avatarContainer: {
    marginBottom: spacing.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  offlineAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lighterGrey,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.lightGrey,
  },
  profileName: {
    ...typography.primary.bold,
    fontSize: 22,
    color: colors.text,
    marginBottom: spacing.tiny,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGrey,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: spacing.tiny,
  },
  statusText: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.card,
    paddingVertical: spacing.medium,
    marginBottom: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.separator,
  },
  statNumber: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.tiny,
  },
  statLabel: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
  },
  actionSection: {
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.large,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.medium,
    borderRadius: 8,
    marginBottom: spacing.small,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.lighterGrey,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  actionIcon: {
    marginRight: spacing.small,
  },
  primaryButtonText: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.white,
  },
  secondaryButtonText: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.primary,
  },
  securitySection: {
    backgroundColor: colors.card,
    padding: spacing.medium,
    borderRadius: 8,
    marginHorizontal: spacing.medium,
  },
  sectionTitle: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  securityItem: {
    flexDirection: "row",
    marginBottom: spacing.medium,
  },
  securityIcon: {
    marginRight: spacing.small,
    marginTop: 2,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  securityDescription: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
  },
})
