import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export const api = {
  get,
  post,
  put,
  patch,
  delete: _delete
}

function get(url, params) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Auth-Token': cookies.get('idToken')
    }
  }
  if (params) {
    url += `?${new URLSearchParams(params)}`
  }
  return fetch(url, requestOptions)
}

function post(url, body) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': cookies.get('idToken')
    },
    body: JSON.stringify(body)
  }
  return fetch(url, requestOptions)
}

function put(url, body) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': cookies.get('idToken')
    },
    body: JSON.stringify(body)
  }
  return fetch(url, requestOptions)
}

function patch(url, body) {
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': cookies.get('idToken')
    },
    body: JSON.stringify(body)
  }
  return fetch(url, requestOptions)
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Auth-Token': cookies.get('idToken')
    }
  }
  return fetch(url, requestOptions)
}

// helper functions

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
