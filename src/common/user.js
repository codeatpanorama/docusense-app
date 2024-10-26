import { userStore } from '../store/user'
import { APIS, AWS_DATA } from '../common/constants'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { useCookies } from 'vue3-cookies'
import { axiosWrapper } from './axios'

const { cookies } = useCookies()

export const getAuthDetails = (name, pwd) => {
  return new AuthenticationDetails({
    Username: name,
    Password: pwd
  })
}

export const POOL_DATA = {
  UserPoolId: AWS_DATA.USER_POOL_ID,
  ClientId: AWS_DATA.CLIENT_ID
}

export const getUserPool = () => {
  return userStore.getState().userPool
}

export const getCognitoUser = (name) => {
  let user = getUserPool().getCurrentUser()
  if (user) {
    return user
  }
  if (name) {
    return new CognitoUser({
      Username: name,
      Pool: getUserPool()
    })
  }
  return null
}

export const authenticateUser = async (result, user) => {
  userStore.authenticate()
  updateLoggedInUser()
  const accessToken = result.getAccessToken().getJwtToken()
  const refreshToken = result.getRefreshToken().getToken()
  const idToken = result.getIdToken().getJwtToken()
  cookies.set('accessToken', accessToken)
  cookies.set('refreshToken', refreshToken)
  cookies.set('idToken', idToken)
  await getEntitlements()
}

export const isSessionValid = async () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser()
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        }
        resolve(session.isValid())
      })
    } else {
      resolve(false)
    }
  })
}

export const updateLoggedInUser = async () => {
  const cognitoUser = getCognitoUser()
  userStore.setUser(cognitoUser)
  try {
    const validSession = await isSessionValid()
    if (validSession) {
      // NOTE: getSession must be called to authenticate user before calling getUserAttributes
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          // Handle error
        } else {
          userStore.setUserInfo(getAttrObj(attributes))
        }
      })
    } else {
      userStore.logout()
    }
  } catch {
    userStore.logout()
  }
}

export const getEntitlements = async () => {
  return await axiosWrapper('get', APIS.ENTITLEMENTS).then(({ data }) =>
    userStore.setUserEntitlements(data.values)
  )
}

const getAttrObj = (attrs) => {
  let attrObj = {}
  for (const attr of attrs) {
    attrObj[attr.Name] = attr.Value
  }
  return attrObj
}
