/**
 * Service for importing and exporting credentials
 */
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import * as Sharing from 'expo-sharing'
import papa from 'papaparse'
import xlsx from 'xlsx'
import { Platform } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { generateId } from '../utils/encryption'
import Config from '../config'
import apiService from './api'

/**
 * File formats supported for import/export
 */
export enum FileFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json'
}

/**
 * Interface for credential import/export
 */
interface CredentialExport {
  id: string
  title: string
  website: string
  username: string
  password: string
  notes?: string
  category?: string
  favorite?: boolean
  createdAt?: string
  updatedAt?: string
  tags?: string[]
}

/**
 * Export credentials to a file
 * @param credentials Array of credentials to export
 * @param format File format to export to
 * @returns Promise with result
 */
export const exportToFile = async (
  credentials: CredentialExport[],
  format: FileFormat = FileFormat.CSV
) => {
  try {
    if (!credentials || credentials.length === 0) {
      return {
        success: false,
        error: 'No credentials to export'
      }
    }
    
    // Create a sanitized copy of credentials for export
    const exportData = credentials.map(cred => ({
      title: cred.title || '',
      website: cred.website || '',
      username: cred.username || '',
      password: cred.password || '',
      notes: cred.notes || '',
      category: cred.category || '',
      favorite: cred.favorite ? 'Yes' : 'No',
      tags: Array.isArray(cred.tags) ? cred.tags.join(', ') : ''
    }))
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const baseFilename = `securevault_export_${timestamp}`
    
    let fileContent: string = ''
    let mimeType: string = ''
    let filename: string = ''
    
    // Create file content based on format
    switch (format) {
      case FileFormat.CSV:
        fileContent = papa.unparse(exportData)
        mimeType = 'text/csv'
        filename = `${baseFilename}.csv`
        break
        
      case FileFormat.XLSX:
        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(exportData)
        xlsx.utils.book_append_sheet(wb, ws, 'Credentials')
        fileContent = xlsx.write(wb, { type: 'base64', bookType: 'xlsx' })
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        filename = `${baseFilename}.xlsx`
        break
        
      case FileFormat.JSON:
        fileContent = JSON.stringify(exportData, null, 2)
        mimeType = 'application/json'
        filename = `${baseFilename}.json`
        break
        
      default:
        return {
          success: false,
          error: 'Unsupported file format'
        }
    }
    
    // Write file to temporary directory
    const filePath = `${FileSystem.cacheDirectory}${filename}`
    
    if (format === FileFormat.XLSX) {
      await FileSystem.writeAsStringAsync(filePath, fileContent, {
        encoding: FileSystem.EncodingType.Base64
      })
    } else {
      await FileSystem.writeAsStringAsync(filePath, fileContent)
    }
    
    // Share the file
    if (Platform.OS === 'web') {
      // On web, we'll use a download approach
      const blob = format === FileFormat.XLSX
        ? new Blob([Buffer.from(fileContent, 'base64')], { type: mimeType })
        : new Blob([fileContent], { type: mimeType })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
      return {
        success: true,
        data: { path: filePath, format }
      }
    } else {
      // On mobile, use sharing
      const canShare = await Sharing.isAvailableAsync()
      
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType,
          dialogTitle: 'Export Credentials',
          UTI: format === FileFormat.XLSX ? 'org.openxmlformats.spreadsheetml.sheet' : 'public.text'
        })
        
        return {
          success: true,
          data: { path: filePath, format }
        }
      } else {
        return {
          success: false,
          error: 'Sharing is not available on this device'
        }
      }
    }
  } catch (error) {
    console.error('Error exporting credentials:', error)
    return {
      success: false,
      error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Import credentials from a file
 * @returns Promise with imported credentials
 */
export const importFromFile = async () => {
  try {
    // Pick a document
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json'
      ],
      copyToCacheDirectory: true
    })
    
    if (result.canceled) {
      return {
        success: false,
        error: 'Document picking was canceled'
      }
    }
    
    const file = result.assets?.[0]
    if (!file || !file.uri) {
      return {
        success: false,
        error: 'Failed to get file information'
      }
    }
    
    // Determine file format
    const fileUri = file.uri
    const fileType = file.mimeType || ''
    
    let format: FileFormat
    if (fileType.includes('csv') || fileUri.endsWith('.csv')) {
      format = FileFormat.CSV
    } else if (fileType.includes('sheet') || fileUri.endsWith('.xlsx') || fileUri.endsWith('.xls')) {
      format = FileFormat.XLSX
    } else if (fileType.includes('json') || fileUri.endsWith('.json')) {
      format = FileFormat.JSON
    } else {
      return {
        success: false,
        error: 'Unsupported file format. Please use CSV, XLSX, or JSON.'
      }
    }
    
    // Read file content
    const fileContent = await FileSystem.readAsStringAsync(fileUri)
    
    // Parse file content based on format
    let parsedData: any[] = []
    
    switch (format) {
      case FileFormat.CSV:
        const csvResult = papa.parse(fileContent, { header: true })
        if (csvResult.errors && csvResult.errors.length > 0) {
          return {
            success: false,
            error: `CSV parsing error: ${csvResult.errors[0].message}`
          }
        }
        parsedData = csvResult.data
        break
        
      case FileFormat.XLSX:
        const workbook = xlsx.read(fileContent, { type: 'string' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        parsedData = xlsx.utils.sheet_to_json(worksheet)
        break
        
      case FileFormat.JSON:
        parsedData = JSON.parse(fileContent)
        break
    }
    
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return {
        success: false,
        error: 'No valid data found in the imported file'
      }
    }
    
    // Transform to our credential format
    const credentials = parsedData.map(item => {
      // Handle various field name formats (different export formats might use different names)
      const getField = (possibleNames: string[]): string => {
        for (const name of possibleNames) {
          if (item[name] !== undefined) {
            return item[name]
          }
        }
        return ''
      }
      
      const title = getField(['title', 'Title', 'name', 'Name'])
      const website = getField(['website', 'Website', 'url', 'URL', 'site', 'Site'])
      const username = getField(['username', 'Username', 'user', 'User', 'login', 'Login', 'email', 'Email'])
      const password = getField(['password', 'Password', 'pass', 'Pass'])
      const notes = getField(['notes', 'Notes', 'comment', 'Comment', 'description', 'Description'])
      const category = getField(['category', 'Category', 'group', 'Group', 'folder', 'Folder'])
      const favorite = getField(['favorite', 'Favorite', 'fav', 'Fav', 'starred', 'Starred'])
      
      // Parse tags
      let tags: string[] = []
      const tagsField = getField(['tags', 'Tags', 'labels', 'Labels'])
      if (tagsField) {
        // Tags might be comma separated or an array
        if (typeof tagsField === 'string') {
          tags = tagsField.split(/,\s*/).filter(Boolean)
        } else if (Array.isArray(tagsField)) {
          tags = tagsField.filter(t => typeof t === 'string')
        }
      }
      
      // Determine if favorite
      const isFavorite = typeof favorite === 'string'
        ? ['yes', 'true', '1', 'y'].includes(favorite.toLowerCase())
        : Boolean(favorite)
      
      return {
        id: generateId(),
        title: title || 'Imported Credential',
        website,
        username,
        password,
        notes,
        category: category || Config.credential.defaultCategory,
        favorite: isFavorite,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
    
    return {
      success: true,
      data: credentials
    }
  } catch (error) {
    console.error('Error importing credentials:', error)
    return {
      success: false,
      error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Export credentials to clipboard as JSON
 * @param credentials Array of credentials to export
 * @returns Promise with result
 */
export const exportToClipboard = async (credentials: CredentialExport[]) => {
  try {
    if (!credentials || credentials.length === 0) {
      return {
        success: false,
        error: 'No credentials to export'
      }
    }
    
    // Create a sanitized copy of credentials for export
    const exportData = credentials.map(cred => ({
      title: cred.title || '',
      website: cred.website || '',
      username: cred.username || '',
      password: cred.password || '',
      notes: cred.notes || '',
      category: cred.category || '',
      favorite: cred.favorite ? 'Yes' : 'No',
      tags: Array.isArray(cred.tags) ? cred.tags.join(', ') : ''
    }))
    
    const jsonString = JSON.stringify(exportData, null, 2)
    
    await Clipboard.setStringAsync(jsonString)
    
    return {
      success: true,
      message: 'Credentials copied to clipboard as JSON'
    }
  } catch (error) {
    console.error('Error exporting to clipboard:', error)
    return {
      success: false,
      error: `Export to clipboard failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Import credentials from clipboard
 * @returns Promise with imported credentials
 */
export const importFromClipboard = async () => {
  try {
    const clipboardContent = await Clipboard.getStringAsync()
    
    if (!clipboardContent) {
      return {
        success: false,
        error: 'Clipboard is empty'
      }
    }
    
    // Try to parse as JSON
    try {
      const parsedData = JSON.parse(clipboardContent)
      
      if (!Array.isArray(parsedData)) {
        return {
          success: false,
          error: 'Clipboard content is not a valid credential array'
        }
      }
      
      // Format the data as credentials
      const credentials = parsedData.map(item => {
        const getField = (possibleNames: string[]): string => {
          for (const name of possibleNames) {
            if (item[name] !== undefined) {
              return item[name]
            }
          }
          return ''
        }
        
        const title = getField(['title', 'Title', 'name', 'Name'])
        const website = getField(['website', 'Website', 'url', 'URL', 'site', 'Site'])
        const username = getField(['username', 'Username', 'user', 'User', 'login', 'Login', 'email', 'Email'])
        const password = getField(['password', 'Password', 'pass', 'Pass'])
        const notes = getField(['notes', 'Notes', 'comment', 'Comment', 'description', 'Description'])
        const category = getField(['category', 'Category', 'group', 'Group', 'folder', 'Folder'])
        const favorite = getField(['favorite', 'Favorite', 'fav', 'Fav', 'starred', 'Starred'])
        
        // Parse tags
        let tags: string[] = []
        const tagsField = getField(['tags', 'Tags', 'labels', 'Labels'])
        if (tagsField) {
          if (typeof tagsField === 'string') {
            tags = tagsField.split(/,\s*/).filter(Boolean)
          } else if (Array.isArray(tagsField)) {
            tags = tagsField.filter(t => typeof t === 'string')
          }
        }
        
        const isFavorite = typeof favorite === 'string'
          ? ['yes', 'true', '1', 'y'].includes(favorite.toLowerCase())
          : Boolean(favorite)
        
        return {
          id: generateId(),
          title: title || 'Imported Credential',
          website,
          username,
          password,
          notes,
          category: category || Config.credential.defaultCategory,
          favorite: isFavorite,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
      
      return {
        success: true,
        data: credentials
      }
    } catch (error) {
      // Not valid JSON, try to parse it as CSV
      try {
        const csvResult = papa.parse(clipboardContent, { header: true })
        
        if (csvResult.errors && csvResult.errors.length > 0) {
          return {
            success: false,
            error: `Clipboard content is not a valid JSON or CSV format: ${csvResult.errors[0].message}`
          }
        }
        
        const credentials = csvResult.data.map((item: any) => {
          const getField = (possibleNames: string[]): string => {
            for (const name of possibleNames) {
              if (item[name] !== undefined) {
                return item[name]
              }
            }
            return ''
          }
          
          // Similar field mapping as above
          const title = getField(['title', 'Title', 'name', 'Name'])
          const website = getField(['website', 'Website', 'url', 'URL', 'site', 'Site'])
          const username = getField(['username', 'Username', 'user', 'User', 'login', 'Login', 'email', 'Email'])
          const password = getField(['password', 'Password', 'pass', 'Pass'])
          const notes = getField(['notes', 'Notes', 'comment', 'Comment', 'description', 'Description'])
          const category = getField(['category', 'Category', 'group', 'Group', 'folder', 'Folder'])
          const favorite = getField(['favorite', 'Favorite', 'fav', 'Fav', 'starred', 'Starred'])
          
          // Parse tags
          let tags: string[] = []
          const tagsField = getField(['tags', 'Tags', 'labels', 'Labels'])
          if (tagsField) {
            tags = tagsField.split(/,\s*/).filter(Boolean)
          }
          
          const isFavorite = typeof favorite === 'string'
            ? ['yes', 'true', '1', 'y'].includes(favorite.toLowerCase())
            : Boolean(favorite)
          
          return {
            id: generateId(),
            title: title || 'Imported Credential',
            website,
            username,
            password,
            notes,
            category: category || Config.credential.defaultCategory,
            favorite: isFavorite,
            tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })
        
        return {
          success: true,
          data: credentials
        }
      } catch (csvError) {
        return {
          success: false,
          error: 'Clipboard content is not in a supported format (JSON or CSV)'
        }
      }
    }
  } catch (error) {
    console.error('Error importing from clipboard:', error)
    return {
      success: false,
      error: `Import from clipboard failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export default {
  exportToFile,
  importFromFile,
  exportToClipboard,
  importFromClipboard,
  FileFormat
}