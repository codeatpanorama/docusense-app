import axios from 'axios'

export async function axiosWrapper(method, url, data, headers, params) {
  return axios({
    method,
    url,
    data,
    headers: {
      ...headers
      //Add auth-token here
    },
    ...params
  })
}
