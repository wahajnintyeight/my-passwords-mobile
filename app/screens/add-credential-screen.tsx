/**
 * Screen for adding a new credential
 */
import React, { FC } from "react"
import { View, StyleSheet, Alert, ScrollView, Text } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { SafeAreaView } from "react-native-safe-area-context"
import { CredentialForm } from "../components/credential-form"
import { Feather } from "@expo/vector-icons"

export const AddCredentialScreen: FC<NativeStackScreenProps<AppStackParamList, "AddCredential">> = ({
  navigation,
}) => {
  const { credentialStore } = useStores()

  const initialValues = {
    title: "",
    website: "",
    username: "",
    password: "",
    notes: "",
  }

  const handleSubmit = async (credential) => {
    try {
      await credentialStore.addCredential({
        ...credential,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })
      Alert.alert("Success", "Credential saved successfully", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to save credential")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Feather name="shield" size={24} color={colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Add New Credential</Text>
        </View>
        <Text style={styles.headerDescription}>
          Enter the details of the credential you want to save. All data will be encrypted and stored securely.
        </Text>
        
        <CredentialForm initialValues={initialValues} onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.small,
  },
  headerIcon: {
    marginRight: spacing.small,
  },
  headerTitle: {
    ...typography.primary.bold,
    fontSize: 22,
    color: colors.text,
  },
  headerDescription: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.large,
    lineHeight: 20,
  },
})
