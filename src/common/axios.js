import axios from 'axios'

export async function axiosWrapper(method, url, data, headers, params) {
  return axios({
    method,
    url,
    data,
    headers: {
      ...headers,
      'Auth-Token': cookies.get('idToken')
    },
    ...params
  })
}
