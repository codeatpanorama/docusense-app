import dayjs from 'dayjs'
import { axiosWrapper } from './axios'

export const downloadItem = ({ url, label, type = 'application/pdf' }) => {
  axiosWrapper('get', url, {}, {}, { responseType: 'blob' })
    .then((response) => {
      const blob = new Blob([response.data], { type })
      downloadBlob(blob, label)
    })
    .catch(console.error)
}

export const downloadBlob = (blob, name) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = name
  link.click()
  URL.revokeObjectURL(link.href)
}

export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noreferrer')
}

export const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export const getWordsFromLocalStorage = () => {
  if (window.localStorage) {
    let searches = window.localStorage.getItem('search')
    if (searches) {
      return JSON.parse(searches)
    }
  }
  return []
}

export const addWordToLocalStorage = (wordData) => {
  if (window.localStorage) {
    let searches = window.localStorage.getItem('search')
    let words = []
    if (searches) {
      words = JSON.parse(searches)
    }
    const exist = words.indexOf(wordData)
    if (exist != -1) {
      words.splice(exist, 1)
    }
    words.unshift(wordData)
    words.length = words.length > 5 ? 5 : words.length
    window.localStorage.setItem('search', JSON.stringify(words))
  }
}

export const encodeBase64 = (str) => {
  return btoa(encodeURIComponent(str))
}

export const decodeBase64 = (str) => {
  return decodeURIComponent(atob(str))
}

export const isMobile = screen.width <= 760

export const formatUTCDate = (date) => {
  return dayjs(date).utc(true).format('DD-MM-YYYY')
}

export const VALIDATION_RULES = {
  REQUIRED: (value) => !!value || 'Required.',
  EMAIL: (value) =>
    /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Please enter a valid email'
}
