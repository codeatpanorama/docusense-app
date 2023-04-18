import axios from "axios"

export const downloadItem = ({ url, label, type = 'application/pdf' }) => {
    axios.get(url, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response.data], { type })
            downloadBlob(blob, label);
        }).catch(console.error)
}

export const downloadBlob = (blob, name) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = name
    link.click()
    URL.revokeObjectURL(link.href)
}

export const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
}

export const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}