export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const APIS = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  DOC_NAMES: `${API_BASE_URL}/api/listDocuments`,
  DOWNLOAD: `${API_BASE_URL}/api/download`,
  REPORT: `${API_BASE_URL}/api/report`,
  ALL_DOCS: `${API_BASE_URL}/api/documents`,
  GET_DOC: `${API_BASE_URL}/api/document`,
  SEARCH: `${API_BASE_URL}/api/search`,
  PREVIEW: `${API_BASE_URL}/api/resultPreview`,
  STATS: `${API_BASE_URL}/api/stats`,
  ELECTORAL_ZONES: `${API_BASE_URL}/api/acs`,
  TASK: `${API_BASE_URL}/api/task`,
  ENTITLEMENTS: `${API_BASE_URL}/api/entitlement`,
  LOGIN: `${API_BASE_URL}/api/hello`,
  HELLO: `${API_BASE_URL}/api/hello`
}

export const DOC_CATEGORIES = [
  'Electoral',
  'Receipt',
  'Contract',
  'Tender',
  'Agreement',
  'Notary',
  'General',
  'Test Document'
]

export const AWS_DATA = {
  CLIENT_ID: 'tn15dut73mm4suikeqkbkti5',
  USER_POOL_ID: 'us-east-1_Fnipguzrl'
}

export const MENU_ITEMS = [
  {
    text: 'Home',
    link: '/',
    icon: 'mdi-home-analytics'
  },
  {
    text: 'File Upload',
    link: '/upload/',
    icon: 'mdi-file-upload',
    restricted: true
  },
  {
    text: 'Bulk Upload',
    link: '/bulk-upload/',
    icon: 'mdi-folder-upload',
    restricted: true
  },
  {
    text: 'Search',
    link: '/search/',
    icon: 'mdi-file-search'
  },
  {
    text: 'Documents',
    link: '/documents/',
    icon: 'mdi-view-list'
  }
]
