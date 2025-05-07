/**
 * The home screen shows the list of saved passwords and credentials
 * with search, filter, and action buttons
 */
import React, { FC, useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { CredentialItem } from "../components/credential-item"
import { ScanButton } from "../components/scan-button"
import { Feather } from "@expo/vector-icons"
import { useStores } from "../models"
import { colors, spacing, typography } from "../theme"
import { Credential } from "../models/credential"
import { SafeAreaView } from "react-native-safe-area-context"

export const HomeScreen: FC<NativeStackScreenProps<AppStackParamList, "Main">> = observer(
  ({ navigation }) => {
    const { credentialStore, authStore } = useStores()
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([])

    useEffect(() => {
      credentialStore.loadCredentials()
    }, [])

    useEffect(() => {
      if (searchQuery.trim() === "") {
        setFilteredCredentials(credentialStore.credentials)
      } else {
        const filtered = credentialStore.credentials.filter(
          (cred) =>
            cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cred.website.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredCredentials(filtered)
      }
    }, [searchQuery, credentialStore.credentials])

    const handleAddCredential = () => {
      navigation.navigate("AddCredential")
    }

    const handleScan = () => {
      navigation.navigate("Scan")
    }

    const handleImportExport = () => {
      navigation.navigate("ImportExport")
    }

    const handleCredentialPress = (id: string) => {
      navigation.navigate("CredentialDetail", { id })
    }

    const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
        <Feather name="lock" size={50} color={colors.textDim} />
        <Text style={styles.emptyTitle}>No passwords yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first password by tapping the + button or scan a login page
        </Text>
      </View>
    )

    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color={colors.textDim} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search passwords..."
                placeholderTextColor={colors.textDim}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={18} color={colors.textDim} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.syncStatus}>
            <Feather 
              name={authStore.isOfflineMode ? "wifi-off" : "cloud"} 
              size={14} 
              color={authStore.isOfflineMode ? colors.error : colors.success} 
            />
            <Text style={styles.syncStatusText}>
              {authStore.isOfflineMode ? "Offline Mode" : "Synced with cloud"}
            </Text>
          </View>

          <FlatList
            data={filteredCredentials}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CredentialItem
                credential={item}
                onPress={() => handleCredentialPress(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />

          <View style={styles.fabContainer}>
            <TouchableOpacity style={styles.importExportButton} onPress={handleImportExport}>
              <Feather name="upload" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCredential}>
              <Feather name="plus" size={24} color={colors.white} />
            </TouchableOpacity>
            <ScanButton onPress={handleScan} />
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
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    padding: spacing.small,
    alignItems: "center",
  },
  searchIcon: {
    marginRight: spacing.tiny,
    marginLeft: spacing.tiny,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    ...typography.primary.normal,
    fontSize: 16,
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.small,
  },
  syncStatusText: {
    ...typography.primary.medium,
    fontSize: 12,
    color: colors.textDim,
    marginLeft: spacing.tiny,
  },
  listContent: {
    padding: spacing.medium,
    paddingBottom: 80, // Provide space for FAB
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.large,
    marginTop: spacing.massive,
  },
  emptyTitle: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.medium,
  },
  emptySubtitle: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    textAlign: "center",
    marginTop: spacing.small,
  },
  fabContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: spacing.small,
  },
  importExportButton: {
    backgroundColor: colors.secondary,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})
