/**
 * Service for importing and exporting credentials
 */
import * as XLSX from 'xlsx';
import { parse as parseCSV, unparse as unparseCSV } from 'papaparse';
import { Base64 } from 'js-base64';
import { Credential } from '../models/credential';

// Field mapping for import/export
const FIELD_MAPPING = {
  title: ['title', 'name', 'account', 'service'],
  website: ['website', 'url', 'site', 'web', 'link'],
  username: ['username', 'user', 'email', 'login', 'account'],
  password: ['password', 'pass', 'secret', 'key'],
  notes: ['notes', 'note', 'description', 'comments', 'additional']
};

/**
 * Import credentials from a file
 * @param fileContent Content of the file
 * @param fileType Type of file (csv or xlsx)
 */
export async function importCredentials(
  fileContent: string,
  fileType: 'csv' | 'xlsx'
): Promise<Credential[]> {
  try {
    let jsonData: Record<string, any>[] = [];

    if (fileType === 'csv') {
      // Parse CSV data
      const result = parseCSV(fileContent, {
        header: true,
        skipEmptyLines: true
      });

      if (result.errors && result.errors.length > 0) {
        console.error('CSV parsing errors:', result.errors);
      }

      jsonData = result.data as Record<string, any>[];
    } else if (fileType === 'xlsx') {
      // Parse XLSX data
      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
    }

    // Map the data to our credential format
    const credentials: Credential[] = jsonData.map(item => {
      const credential: Partial<Credential> = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 10),
        createdAt: new Date().toISOString()
      };

      // Try to map fields using various possible names
      for (const [fieldName, possibleNames] of Object.entries(FIELD_MAPPING)) {
        const foundKey = Object.keys(item).find(key => 
          possibleNames.includes(key.toLowerCase())
        );
        
        if (foundKey && item[foundKey]) {
          credential[fieldName] = item[foundKey];
        }
      }

      // Ensure all required fields have at least empty values
      return {
        id: credential.id || Date.now().toString(),
        title: credential.title || '',
        website: credential.website || '',
        username: credential.username || '',
        password: credential.password || '',
        notes: credential.notes || '',
        createdAt: credential.createdAt || new Date().toISOString(),
      };
    })
    .filter(credential => 
      // Only include credentials that have at least a username or password
      credential.username || credential.password
    );

    return credentials;
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Failed to import credentials');
  }
}

/**
 * Export credentials to a file
 * @param credentials Credentials to export
 * @param fileType Type of file to export (csv or xlsx)
 */
export async function exportCredentials(
  credentials: Credential[],
  fileType: 'csv' | 'xlsx'
): Promise<string> {
  try {
    // Map credentials to simple objects for export
    const data = credentials.map(cred => ({
      Title: cred.title,
      Website: cred.website,
      Username: cred.username,
      Password: cred.password,
      Notes: cred.notes,
      Created: new Date(cred.createdAt).toLocaleDateString(),
      Modified: cred.updatedAt ? new Date(cred.updatedAt).toLocaleDateString() : ''
    }));

    if (fileType === 'csv') {
      // Generate CSV
      const csv = unparseCSV(data, {
        quotes: true,
        header: true
      });
      return csv;
    } else if (fileType === 'xlsx') {
      // Generate XLSX
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Passwords');
      
      // Convert to base64
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      return wbout;
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export credentials');
  }
}
