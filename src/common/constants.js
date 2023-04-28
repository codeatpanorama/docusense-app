//export const API_BASE_URL = "http://43.239.110.16:8080/api"
export const API_BASE_URL = "http://localhost:8080/api"

export const APIS = {
    UPLOAD: `${API_BASE_URL}/upload`,
    DOC_NAMES: `${API_BASE_URL}/listDocuments`,
    DOWNLOAD: `${API_BASE_URL}/download`,
    ALL_DOCS: `${API_BASE_URL}/documents`,
    GET_DOC: `${API_BASE_URL}/document`,
    SEARCH: `${API_BASE_URL}/search`,
    PREVIEW: `${API_BASE_URL}/resultPreview`,
    STATS: `${API_BASE_URL}/stats`,
    LOGIN: `${API_BASE_URL}/hello`,
    HELLO: `${API_BASE_URL}/hello`,
}

export const DOC_CATEGORIES = [
    'Receipt',
    'Contract',
    'Tender',
    'Agreement',
    'Notary',
    'Test Document'
]

export const AWS_DATA = {
    CLIENT_ID: "tn15dut73mm4suikeqkbkti5",
    USER_POOL_ID: "us-east-1_Fnipguzrl"
}