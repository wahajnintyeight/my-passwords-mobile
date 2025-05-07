/**
 * Specialized button component for the OCR scanning feature
 */
import React, { FC } from "react"
import { StyleSheet, TouchableOpacity, Text, View } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"

interface ScanButtonProps {
  onPress: () => void
  size?: "small" | "large"
}

export const ScanButton: FC<ScanButtonProps> = ({ onPress, size = "large" }) => {
  const isSmall = size === "small"

  return (
    <TouchableOpacity
      style={[styles.button, isSmall ? styles.smallButton : styles.largeButton]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Feather
          name="camera"
          size={isSmall ? 18 : 22}
          color={colors.white}
          style={styles.scanIcon}
        />
        <Feather
          name="search"
          size={isSmall ? 12 : 16}
          color={colors.white}
          style={styles.searchIcon}
        />
      </View>
      {!isSmall && <Text style={styles.label}>Scan</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 28,
    elevation: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.small,
  },
  largeButton: {
    width: 56,
    height: 56,
  },
  smallButton: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    position: "relative",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    position: "absolute",
  },
  searchIcon: {
    position: "absolute",
    right: -3,
    bottom: -3,
  },
  label: {
    ...typography.primary.semiBold,
    fontSize: 10,
    color: colors.white,
    marginTop: 2,
  },
})
