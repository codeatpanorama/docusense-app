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
  CONSTITUENCY_STATS: `${API_BASE_URL}/api/constituency-stats`,
  ELECTORAL_ZONES: `${API_BASE_URL}/api/acs`,
  TASK: `${API_BASE_URL}/api/task`,
  ENTITLEMENTS: `${API_BASE_URL}/api/entitlement`,
  LOGIN: `${API_BASE_URL}/api/hello`,
  HELLO: `${API_BASE_URL}/api/hello`,
  USER: `${API_BASE_URL}/api/user`,
  USERS: `${API_BASE_URL}/api/users`

}

export const DOC_CATEGORIES = [
  //'Agreement',
  'Bank Checks',
  //'Contract',
  //'Electoral',
  //'General',
  //'Notary',
  //'Receipt',
  //'Tender',
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
    text: 'Search',
    link: '/search/',
    icon: 'mdi-file-search'
  },
  {
    text: 'Documents',
    link: '/documents/',
    icon: 'mdi-view-list'
  },

]
