import React, { Component, ErrorInfo, ReactNode } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { colors, spacing } from "../../theme"

interface Props {
  children: ReactNode
  catchErrors: boolean
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary to catch and display errors that occur in the component tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, errorInfo: null }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    const { error, errorInfo } = this.state

    if (error !== null && this.props.catchErrors) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong!</Text>
          <Text style={styles.subtitle}>
            The app encountered an unexpected error. You may need to restart the app.
          </Text>
          <ScrollView style={styles.errorContainer}>
            <Text style={styles.errorText}>{error.toString()}</Text>
            <Text style={styles.errorText}>{errorInfo?.componentStack}</Text>
          </ScrollView>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.error,
    marginBottom: spacing.medium,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.extraLarge,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: spacing.medium,
    borderRadius: 6,
  },
  errorText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: "monospace",
  },
})