/**
 * Screen that implements OCR scanning of login fields
 */
import React, { FC, useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/app-navigator"
import { Camera, CameraType } from "expo-camera"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { useStores } from "../models"
import { CredentialForm } from "../components/credential-form"
import { ocrProcessImage } from "../services/ocr-service"

export const ScanScreen: FC<NativeStackScreenProps<AppStackParamList, "Scan">> = ({ navigation }) => {
  const { credentialStore } = useStores()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.back)
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scannedData, setScannedData] = useState({
    website: "",
    title: "",
    username: "",
    password: "",
    notes: "",
  })
  
  const cameraRef = useRef<Camera>(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        setScanning(true)
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        })

        // Process the captured image with OCR
        const ocrResult = await ocrProcessImage(photo.base64)
        
        if (ocrResult.success) {
          setScannedData({
            website: ocrResult.data.website || "",
            title: ocrResult.data.title || "",
            username: ocrResult.data.username || "",
            password: ocrResult.data.password || "",
            notes: "",
          })
          setScanComplete(true)
        } else {
          Alert.alert(
            "Scan Failed", 
            "Could not detect login fields. Please try again or add the credential manually.",
            [{ text: "OK" }]
          )
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while scanning. Please try again.")
        console.error("Camera error:", error)
      } finally {
        setScanning(false)
      }
    }
  }

  const handleSave = async (credential) => {
    try {
      await credentialStore.addCredential({
        ...credential,
        id: Date.now().toString(),
      })
      Alert.alert("Success", "Credential saved successfully", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to save credential")
    }
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  const resetScan = () => {
    setScanComplete(false)
    setScannedData({
      website: "",
      title: "",
      username: "",
      password: "",
      notes: "",
    })
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!scanComplete ? (
        <>
          <View style={styles.cameraContainer}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.flipButton} 
                  onPress={toggleCameraType}
                >
                  <Feather name="refresh-cw" size={22} color={colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.scanOverlay}>
                <View style={styles.scanFrame}>
                  {/* Scan frame UI */}
                  <View style={styles.scanCorner1} />
                  <View style={styles.scanCorner2} />
                  <View style={styles.scanCorner3} />
                  <View style={styles.scanCorner4} />
                </View>
              </View>
            </Camera>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Scan Login Screen</Text>
            <Text style={styles.instructionsText}>
              Point your camera at a login form to capture username and password fields.
              Make sure the entire form is visible.
            </Text>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, scanning && styles.disabledButton]}
              onPress={handleCapture}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Feather name="camera" size={24} color={colors.white} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => navigation.navigate("AddCredential")}
            >
              <Text style={styles.manualButtonText}>Manual</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Review Scanned Information</Text>
            <Text style={styles.formSubtitle}>
              Please verify the detected information and make any necessary corrections
            </Text>
          </View>

          <CredentialForm
            initialValues={scannedData}
            onSubmit={handleSave}
          />

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.rescanButton} onPress={resetScan}>
              <Feather name="refresh-cw" size={18} color={colors.primary} style={styles.actionIcon} />
              <Text style={styles.rescanButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraContainer: {
    height: "60%",
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    top: spacing.medium,
    right: spacing.medium,
    zIndex: 10,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent,
    justifyContent: "center",
    alignItems: "center",
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 180,
    borderRadius: 8,
    position: "relative",
  },
  scanCorner1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.white,
  },
  scanCorner2: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.white,
  },
  scanCorner3: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.white,
  },
  scanCorner4: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.white,
  },
  instructionsContainer: {
    padding: spacing.medium,
    backgroundColor: colors.card,
  },
  instructionsTitle: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.small,
  },
  instructionsText: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 20,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    padding: spacing.medium,
  },
  cancelButtonText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.textDim,
  },
  manualButton: {
    padding: spacing.medium,
  },
  manualButtonText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.primary,
  },
  errorText: {
    ...typography.primary.medium,
    fontSize: 16,
    color: colors.error,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
  },
  buttonText: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    padding: spacing.medium,
  },
  formHeader: {
    marginBottom: spacing.medium,
  },
  formTitle: {
    ...typography.primary.bold,
    fontSize: 22,
    color: colors.text,
    marginBottom: spacing.small,
  },
  formSubtitle: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.medium,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: spacing.large,
  },
  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGrey,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  rescanButtonText: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.primary,
  },
  actionIcon: {
    marginRight: spacing.small,
  },
})
