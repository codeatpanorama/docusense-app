import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

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
