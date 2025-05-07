/**
 * Settings screen for app configuration and preferences
 */
import React, { FC, useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { SafeAreaView } from "react-native-safe-area-context"

export const SettingsScreen: FC<NativeStackScreenProps<AppStackParamList, "Main">> = observer(
  ({ navigation }) => {
    const { authStore, credentialStore } = useStores()
    const [biometricEnabled, setBiometricEnabled] = useState(false)
    const [autoFill, setAutoFill] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    const handleLogout = () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out? Your data will still be available offline.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Log Out",
            style: "destructive",
            onPress: async () => {
              await authStore.logout()
              // Stay on the same screen but now in offline mode
            },
          },
        ]
      )
    }

    const handleDeleteAllData = () => {
      Alert.alert(
        "Delete All Data",
        "Are you sure you want to delete all your saved passwords? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await credentialStore.deleteAllCredentials()
            },
          },
        ]
      )
    }

    const handleSyncNow = async () => {
      try {
        if (authStore.isOfflineMode) {
          Alert.alert(
            "Sync Unavailable",
            "You are currently in offline mode. Please log in to enable syncing.",
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
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="fingerprint" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.lightGrey, true: colors.primaryDark }}
                thumbColor={biometricEnabled ? colors.primary : colors.white}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="clock" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Auto-Lock App</Text>
              </View>
              <TouchableOpacity style={styles.valueSelector}>
                <Text style={styles.valueText}>After 1 minute</Text>
                <Feather name="chevron-right" size={20} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="eye" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Hide Passwords</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.lightGrey, true: colors.primaryDark }}
                thumbColor={true ? colors.primary : colors.white}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="moon" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.lightGrey, true: colors.primaryDark }}
                thumbColor={darkMode ? colors.primary : colors.white}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="edit" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Auto-Fill Credentials</Text>
              </View>
              <Switch
                value={autoFill}
                onValueChange={setAutoFill}
                trackColor={{ false: colors.lightGrey, true: colors.primaryDark }}
                thumbColor={autoFill ? colors.primary : colors.white}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            <TouchableOpacity style={styles.actionRow} onPress={handleSyncNow}>
              <View style={styles.settingInfo}>
                <Feather name="refresh-cw" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Sync Now</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textDim} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate("ImportExport")}
            >
              <View style={styles.settingInfo}>
                <Feather name="upload" size={22} style={styles.icon} />
                <Text style={styles.settingTitle}>Import/Export Passwords</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {!authStore.isOfflineMode ? (
              <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
                <View style={styles.settingInfo}>
                  <Feather name="log-out" size={22} style={[styles.icon, styles.dangerIcon]} />
                  <Text style={[styles.settingTitle, styles.dangerText]}>Log Out</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate("Splash")}
              >
                <View style={styles.settingInfo}>
                  <Feather name="log-in" size={22} style={styles.icon} />
                  <Text style={styles.settingTitle}>Sign In</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionRow} onPress={handleDeleteAllData}>
              <View style={styles.settingInfo}>
                <Feather name="trash-2" size={22} style={[styles.icon, styles.dangerIcon]} />
                <Text style={[styles.settingTitle, styles.dangerText]}>Delete All Data</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.about}>
            <Text style={styles.version}>SecureVault v1.0.0</Text>
            <Text style={styles.copyright}>© 2023 SecureVault</Text>
          </View>
        </ScrollView>
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
  section: {
    marginBottom: spacing.large,
    paddingHorizontal: spacing.medium,
  },
  sectionTitle: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.small,
    marginTop: spacing.medium,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: colors.primaryDark,
    marginRight: spacing.small,
  },
  dangerIcon: {
    color: colors.error,
  },
  settingTitle: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.text,
  },
  dangerText: {
    color: colors.error,
  },
  valueSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    marginRight: spacing.tiny,
  },
  about: {
    alignItems: "center",
    marginVertical: spacing.large,
  },
  version: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
  },
  copyright: {
    ...typography.primary.normal,
    fontSize: 12,
    color: colors.textDim,
    marginTop: spacing.tiny,
  },
})
