/**
 * Component to display a credential item in a list
 */
import React, { FC, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { Credential } from "../models/credential"

interface CredentialItemProps {
  credential: Credential
  onPress: () => void
}

export const CredentialItem: FC<CredentialItemProps> = ({ credential, onPress }) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const getInitial = () => {
    if (credential.title && credential.title.length > 0) {
      return credential.title[0].toUpperCase()
    }
    return "P"
  }

  // Create a simple hash of the website to deterministically choose a color
  const getColorIndex = (website: string) => {
    let hash = 0
    for (let i = 0; i < website.length; i++) {
      hash = website.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % backgroundColors.length
  }

  const backgroundColors = [
    "#4C6EF5", // blue
    "#FA5252", // red
    "#40C057", // green
    "#FD7E14", // orange
    "#7950F2", // purple
    "#228BE6", // light blue
    "#F06595", // pink
    "#12B886", // teal
  ]

  const backgroundColor = backgroundColors[getColorIndex(credential.website)]

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Text style={styles.initialLetter}>{getInitial()}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {credential.title}
        </Text>
        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
          {credential.username}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Text style={styles.passwordDots}>
            {passwordVisible ? credential.password : "•••••"}
          </Text>
          <Feather
            name={passwordVisible ? "eye-off" : "eye"}
            size={16}
            color={colors.textDim}
          />
        </TouchableOpacity>
        <Text style={styles.website} numberOfLines={1} ellipsizeMode="tail">
          {credential.website}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.separator,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.small,
  },
  initialLetter: {
    ...typography.primary.bold,
    fontSize: 18,
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    ...typography.primary.normal,
    fontSize: 14,
    color: colors.textDim,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  passwordToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordDots: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.tiny,
  },
  website: {
    ...typography.primary.normal,
    fontSize: 12,
    color: colors.textDim,
    marginTop: 4,
  },
})
