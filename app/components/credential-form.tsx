/**
 * Reusable form component for adding or editing credentials
 */
import React, { FC, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "../theme"
import { generatePassword } from "../utils/encryption"

interface CredentialFormProps {
  initialValues: {
    title: string
    website: string
    username: string
    password: string
    notes: string
  }
  onSubmit: (values: any) => void
}

export const CredentialForm: FC<CredentialFormProps> = ({ initialValues, onSubmit }) => {
  const [values, setValues] = useState({
    title: initialValues.title || "",
    website: initialValues.website || "",
    username: initialValues.username || "",
    password: initialValues.password || "",
    notes: initialValues.notes || "",
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [passwordLength, setPasswordLength] = useState(16)

  const handleChange = (field: string, value: string) => {
    setValues({
      ...values,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    onSubmit(values)
  }

  const generateNewPassword = () => {
    const newPassword = generatePassword({
      length: passwordLength,
      uppercase: includeUppercase,
      lowercase: includeLowercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    })
    
    handleChange("password", newPassword)
  }

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Title</Text>
        <View style={styles.inputContainer}>
          <Feather name="tag" size={18} color={colors.textDim} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Gmail, Facebook"
            placeholderTextColor={colors.textDim}
            value={values.title}
            onChangeText={(text) => handleChange("title", text)}
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Website</Text>
        <View style={styles.inputContainer}>
          <Feather name="globe" size={18} color={colors.textDim} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. gmail.com"
            placeholderTextColor={colors.textDim}
            value={values.website}
            onChangeText={(text) => handleChange("website", text)}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username / Email</Text>
        <View style={styles.inputContainer}>
          <Feather name="user" size={18} color={colors.textDim} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. john.doe@example.com"
            placeholderTextColor={colors.textDim}
            value={values.username}
            onChangeText={(text) => handleChange("username", text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Feather name="key" size={18} color={colors.textDim} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textDim}
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather name={passwordVisible ? "eye-off" : "eye"} size={18} color={colors.textDim} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={generateNewPassword}
        >
          <Feather name="refresh-cw" size={14} color={colors.primary} style={styles.generateIcon} />
          <Text style={styles.generateText}>Generate Secure Password</Text>
        </TouchableOpacity>
        
        <View style={styles.passwordOptionsContainer}>
          <View style={styles.passwordOptionRow}>
            <View style={styles.passwordOption}>
              <Text style={styles.passwordOptionLabel}>A-Z</Text>
              <Switch
                value={includeUppercase}
                onValueChange={setIncludeUppercase}
                trackColor={{ false: colors.lightGrey, true: colors.primaryLight }}
                thumbColor={includeUppercase ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.passwordOption}>
              <Text style={styles.passwordOptionLabel}>a-z</Text>
              <Switch
                value={includeLowercase}
                onValueChange={setIncludeLowercase}
                trackColor={{ false: colors.lightGrey, true: colors.primaryLight }}
                thumbColor={includeLowercase ? colors.primary : colors.white}
              />
            </View>
          </View>
          
          <View style={styles.passwordOptionRow}>
            <View style={styles.passwordOption}>
              <Text style={styles.passwordOptionLabel}>0-9</Text>
              <Switch
                value={includeNumbers}
                onValueChange={setIncludeNumbers}
                trackColor={{ false: colors.lightGrey, true: colors.primaryLight }}
                thumbColor={includeNumbers ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.passwordOption}>
              <Text style={styles.passwordOptionLabel}>!@#$</Text>
              <Switch
                value={includeSymbols}
                onValueChange={setIncludeSymbols}
                trackColor={{ false: colors.lightGrey, true: colors.primaryLight }}
                thumbColor={includeSymbols ? colors.primary : colors.white}
              />
            </View>
          </View>
          
          <View style={styles.lengthContainer}>
            <Text style={styles.lengthLabel}>Length: {passwordLength}</Text>
            <View style={styles.lengthControls}>
              <TouchableOpacity 
                style={styles.lengthButton} 
                onPress={() => setPasswordLength(Math.max(8, passwordLength - 1))}
              >
                <Feather name="minus" size={16} color={colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.lengthBar}>
                <View style={[styles.lengthFill, { width: `${(passwordLength - 8) / 24 * 100}%` }]} />
              </View>
              
              <TouchableOpacity 
                style={styles.lengthButton} 
                onPress={() => setPasswordLength(Math.min(32, passwordLength + 1))}
              >
                <Feather name="plus" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <View style={styles.inputContainer}>
          <Feather name="file-text" size={18} color={colors.textDim} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Add additional notes"
            placeholderTextColor={colors.textDim}
            value={values.notes}
            onChangeText={(text) => handleChange("notes", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.medium,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  fieldContainer: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.tiny,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    paddingHorizontal: spacing.small,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  inputIcon: {
    marginRight: spacing.small,
  },
  input: {
    ...typography.primary.normal,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.small,
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    paddingTop: spacing.small,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.small,
    padding: spacing.small,
    backgroundColor: colors.lighterGrey,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  generateIcon: {
    marginRight: spacing.tiny,
  },
  generateText: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.primary,
  },
  passwordOptionsContainer: {
    marginTop: spacing.small,
    backgroundColor: colors.lighterGrey,
    borderRadius: 8,
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  passwordOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.small,
  },
  passwordOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },
  passwordOptionLabel: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
    marginRight: spacing.small,
  },
  lengthContainer: {
    marginTop: spacing.small,
  },
  lengthLabel: {
    ...typography.primary.medium,
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.tiny,
  },
  lengthControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  lengthButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.separator,
  },
  lengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.lightGrey,
    borderRadius: 3,
    marginHorizontal: spacing.small,
  },
  lengthFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.medium,
  },
  submitButtonText: {
    ...typography.primary.bold,
    fontSize: 16,
    color: colors.white,
  },
})
