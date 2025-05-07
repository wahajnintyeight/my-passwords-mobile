/**
 * Screen for importing and exporting password data
 */
import React, { FC, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { SafeAreaView } from "react-native-safe-area-context"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { importCredentials, exportCredentials } from "../services/import-export-service"

export const ImportExportScreen: FC<NativeStackScreenProps<AppStackParamList, "ImportExport">> = ({
  navigation,
}) => {
  const { credentialStore } = useStores()
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleImportCSV = async () => {
    try {
      setImporting(true)
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      })

      if (result.type === "success") {
        // Read the file content
        const fileContent = await FileSystem.readAsStringAsync(result.uri)
        
        // Process the CSV data
        const importedCredentials = await importCredentials(fileContent, "csv")
        
        if (importedCredentials.length > 0) {
          // Add the imported credentials to the store
          await credentialStore.importCredentials(importedCredentials)
          
          Alert.alert(
            "Import Successful",
            `Successfully imported ${importedCredentials.length} passwords.`,
            [{ text: "OK" }]
          )
        } else {
          Alert.alert("Import Failed", "No valid credentials found in the CSV file.")
        }
      }
    } catch (error) {
      console.error("Import error:", error)
      Alert.alert("Import Failed", "An error occurred while importing the file.")
    } finally {
      setImporting(false)
    }
  }

  const handleImportXLSX = async () => {
    try {
      setImporting(true)
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        copyToCacheDirectory: true,
      })

      if (result.type === "success") {
        // Read the file content as base64
        const base64Content = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        })
        
        // Process the XLSX data
        const importedCredentials = await importCredentials(base64Content, "xlsx")
        
        if (importedCredentials.length > 0) {
          // Add the imported credentials to the store
          await credentialStore.importCredentials(importedCredentials)
          
          Alert.alert(
            "Import Successful",
            `Successfully imported ${importedCredentials.length} passwords.`,
            [{ text: "OK" }]
          )
        } else {
          Alert.alert("Import Failed", "No valid credentials found in the XLSX file.")
        }
      }
    } catch (error) {
      console.error("Import error:", error)
      Alert.alert("Import Failed", "An error occurred while importing the file.")
    } finally {
      setImporting(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      setExporting(true)

      // Check if we have credentials to export
      if (credentialStore.credentials.length === 0) {
        Alert.alert("Nothing to Export", "You don't have any saved passwords to export.")
        return
      }

      // Generate CSV data
      const csvData = await exportCredentials(credentialStore.credentials, "csv")

      // Create a temporary file
      const fileUri = `${FileSystem.cacheDirectory}passwords_export_${Date.now()}.csv`
      await FileSystem.writeAsStringAsync(fileUri, csvData)

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Passwords as CSV",
        })
      } else {
        Alert.alert("Sharing Not Available", "Sharing is not available on this device.")
      }
    } catch (error) {
      console.error("Export error:", error)
      Alert.alert("Export Failed", "An error occurred while exporting the file.")
    } finally {
      setExporting(false)
    }
  }

  const handleExportXLSX = async () => {
    try {
      setExporting(true)

      // Check if we have credentials to export
      if (credentialStore.credentials.length === 0) {
        Alert.alert("Nothing to Export", "You don't have any saved passwords to export.")
        return
      }

      // Generate XLSX data
      const xlsxData = await exportCredentials(credentialStore.credentials, "xlsx")

      // Create a temporary file
      const fileUri = `${FileSystem.cacheDirectory}passwords_export_${Date.now()}.xlsx`
      await FileSystem.writeAsStringAsync(fileUri, xlsxData, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Export Passwords as XLSX",
        })
      } else {
        Alert.alert("Sharing Not Available", "Sharing is not available on this device.")
      }
    } catch (error) {
      console.error("Export error:", error)
      Alert.alert("Export Failed", "An error occurred while exporting the file.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Import Passwords</Text>
          <Text style={styles.sectionDescription}>
            Import your passwords from CSV or XLSX files. Your existing passwords will not be
            affected.
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleImportCSV}
              disabled={importing}
            >
              {importing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Feather name="file-text" size={28} color={colors.primary} style={styles.optionIcon} />
                  <Text style={styles.optionTitle}>Import from CSV</Text>
                  <Text style={styles.optionDescription}>Import from comma-separated values file</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleImportXLSX}
              disabled={importing}
            >
              {importing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Feather name="file" size={28} color={colors.primary} style={styles.optionIcon} />
                  <Text style={styles.optionTitle}>Import from XLSX</Text>
                  <Text style={styles.optionDescription}>Import from Excel spreadsheet file</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Passwords</Text>
          <Text style={styles.sectionDescription}>
            Export all your saved passwords to a file. This file will contain sensitive information,
            so keep it secure.
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleExportCSV}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Feather name="download" size={28} color={colors.primary} style={styles.optionIcon} />
                  <Text style={styles.optionTitle}>Export as CSV</Text>
                  <Text style={styles.optionDescription}>
                    Export to comma-separated values file
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleExportXLSX}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Feather name="download" size={28} color={colors.primary} style={styles.optionIcon} />
                  <Text style={styles.optionTitle}>Export as XLSX</Text>
                  <Text style={styles.optionDescription}>Export to Excel spreadsheet file</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.noticeSection}>
          <Feather name="alert-triangle" size={20} color={colors.textDim} style={styles.noticeIcon} />
          <Text style={styles.noticeText}>
            Exported files contain your actual passwords in readable format. Make sure to keep these
            files secure and delete them when no longer needed.
          </Text>
        </View>
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
  contentContainer: {
    padding: spacing.medium,
  },
  section: {
    marginBottom: spacing.large,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.medium,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  sectionTitle: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.small,
  },
  sectionDescription: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.medium,
    lineHeight: 20,
  },
  optionsContainer: {
    marginTop: spacing.small,
  },
  optionButton: {
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  optionIcon: {
    marginBottom: spacing.small,
  },
  optionTitle: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.tiny,
  },
  optionDescription: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
  },
  noticeSection: {
    flexDirection: "row",
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.large,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  noticeIcon: {
    marginRight: spacing.small,
    marginTop: 2,
  },
  noticeText: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
    flex: 1,
    lineHeight: 20,
  },
})
