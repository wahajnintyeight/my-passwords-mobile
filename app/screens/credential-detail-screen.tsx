/**
 * Screen to view and edit credential details
 */
import React, { FC, useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { SafeAreaView } from "react-native-safe-area-context"
import { CredentialForm } from "../components/credential-form"
import * as Clipboard from "expo-clipboard"

export const CredentialDetailScreen: FC<NativeStackScreenProps<AppStackParamList, "CredentialDetail">> = ({
  route,
  navigation,
}) => {
  const { id } = route.params
  const { credentialStore } = useStores()
  const [credential, setCredential] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const cred = await credentialStore.getCredentialById(id)
        setCredential(cred)
      } catch (error) {
        Alert.alert("Error", "Failed to load credential details")
        navigation.goBack()
      } finally {
        setLoading(false)
      }
    }

    fetchCredential()
  }, [id])

  const handleDelete = () => {
    Alert.alert(
      "Delete Credential",
      "Are you sure you want to delete this credential? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await credentialStore.deleteCredential(id)
              navigation.goBack()
            } catch (error) {
              Alert.alert("Error", "Failed to delete credential")
            }
          },
        },
      ]
    )
  }

  const handleUpdate = async (updatedCredential) => {
    try {
      await credentialStore.updateCredential(id, updatedCredential)
      setCredential({ ...credential, ...updatedCredential })
      setEditing(false)
      Alert.alert("Success", "Credential updated successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to update credential")
    }
  }

  const copyToClipboard = async (text, field) => {
    await Clipboard.setStringAsync(text)
    Alert.alert("Copied", `${field} copied to clipboard`)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <ScrollView style={styles.container}>
        {!editing ? (
          <View style={styles.detailsContainer}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Feather name="lock" size={24} color={colors.white} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{credential.title}</Text>
                <Text style={styles.website}>{credential.website}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                <Feather name="edit-2" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Feather name="user" size={18} color={colors.textDim} style={styles.fieldIcon} />
                  <Text style={styles.fieldLabel}>Username</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{credential.username}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(credential.username, "Username")}
                  >
                    <Feather name="copy" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Feather name="key" size={18} color={colors.textDim} style={styles.fieldIcon} />
                  <Text style={styles.fieldLabel}>Password</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>
                    {passwordVisible ? credential.password : "•".repeat(credential.password.length)}
                  </Text>
                  <View style={styles.passwordActions}>
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      style={styles.visibilityButton}
                    >
                      <Feather
                        name={passwordVisible ? "eye-off" : "eye"}
                        size={18}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(credential.password, "Password")}
                    >
                      <Feather name="copy" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {credential.notes ? (
                <View style={styles.fieldContainer}>
                  <View style={styles.fieldLabelContainer}>
                    <Feather
                      name="file-text"
                      size={18}
                      color={colors.textDim}
                      style={styles.fieldIcon}
                    />
                    <Text style={styles.fieldLabel}>Notes</Text>
                  </View>
                  <View style={styles.notesContainer}>
                    <Text style={styles.notes}>{credential.notes}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.createdDateContainer}>
              <Text style={styles.createdDate}>Created: {new Date(credential.createdAt).toLocaleString()}</Text>
              {credential.updatedAt && (
                <Text style={styles.updatedDate}>
                  Updated: {new Date(credential.updatedAt).toLocaleString()}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Feather name="trash-2" size={18} color={colors.error} style={styles.deleteIcon} />
              <Text style={styles.deleteText}>Delete Credential</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <CredentialForm initialValues={credential} onSubmit={handleUpdate} />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  detailsContainer: {
    flex: 1,
    padding: spacing.medium,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.medium,
    backgroundColor: colors.card,
    padding: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 2,
  },
  website: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lighterGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  fieldContainer: {
    marginBottom: spacing.medium,
  },
  fieldLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.tiny,
  },
  fieldIcon: {
    marginRight: spacing.tiny,
  },
  fieldLabel: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
  },
  fieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lighterGrey,
    padding: spacing.small,
    borderRadius: 6,
  },
  fieldValue: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  notesContainer: {
    backgroundColor: colors.lighterGrey,
    padding: spacing.small,
    borderRadius: 6,
  },
  notes: {
    ...typography.primary.normal,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  passwordActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityButton: {
    marginRight: spacing.medium,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.medium,
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    marginTop: spacing.medium,
  },
  deleteIcon: {
    marginRight: spacing.small,
  },
  deleteText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.error,
  },
  createdDateContainer: {
    padding: spacing.small,
  },
  createdDate: {
    ...typography.primary.normal,
    fontSize: 12,
    color: colors.textDim,
    textAlign: "center",
  },
  updatedDate: {
    ...typography.primary.normal,
    fontSize: 12,
    color: colors.textDim,
    textAlign: "center",
    marginTop: 2,
  },
  formContainer: {
    padding: spacing.medium,
  },
  cancelButton: {
    alignItems: "center",
    padding: spacing.medium,
    marginTop: spacing.medium,
  },
  cancelButtonText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.error,
  },
})
