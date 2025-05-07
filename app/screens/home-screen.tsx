/**
 * The home screen shows the list of saved passwords and credentials
 * with search, filter, and action buttons
 */
import React, { useState, FC } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, SafeAreaView } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { colors, spacing } from "../theme"
import { observer } from "mobx-react-lite"
import { useRootStore } from "../models"
import { Ionicons } from "@expo/vector-icons"

export const HomeScreen: FC<NativeStackScreenProps<AppStackParamList, "Main">> = observer(
  ({ navigation }) => {
    const { credentialStore } = useRootStore()
    const [searchQuery, setSearchQuery] = useState("")

    // Filter credentials based on search query
    const filteredCredentials = credentialStore.credentials.filter((credential) =>
      credential.matchesSearch(searchQuery)
    )

    const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="key-outline" size={64} color={colors.lightGrey} />
        <Text style={styles.emptyTitle}>No credentials yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first password by tapping the + button below
        </Text>
      </View>
    )

    const renderCredentialItem = ({ item }) => (
      <TouchableOpacity
        style={styles.credentialItem}
        onPress={() => navigation.navigate("CredentialDetail", { id: item.id })}
      >
        <View style={styles.credentialIcon}>
          <Text style={styles.iconText}>{item.website.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.credentialInfo}>
          <Text style={styles.credentialTitle}>{item.title}</Text>
          <Text style={styles.credentialSubtitle}>{item.username}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
      </TouchableOpacity>
    )

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Passwords</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textDim} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search passwords..."
            placeholderTextColor={colors.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.textDim} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredCredentials}
          renderItem={renderCredentialItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.fabSecondary}
            onPress={() => navigation.navigate("Scan")}
          >
            <Ionicons name="camera-outline" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("AddCredential")}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
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
  header: {
    padding: spacing.medium,
    paddingTop: spacing.large,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGrey,
    margin: spacing.medium,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
  },
  searchIcon: {
    marginRight: spacing.small,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.medium,
  },
  credentialItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.medium,
    borderRadius: 8,
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  credentialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  iconText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  credentialSubtitle: {
    fontSize: 14,
    color: colors.textDim,
  },
  bottomActions: {
    position: "absolute",
    bottom: spacing.large,
    right: spacing.large,
    flexDirection: "row",
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.massive,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.large,
    marginBottom: spacing.small,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textDim,
    textAlign: "center",
  },
})