import axios from "axios"

export const downloadItem = ({ url, label, type = 'application/pdf' }) => {
    axios.get(url, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response.data], { type })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
        }).catch(console.error)
}

export const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
}