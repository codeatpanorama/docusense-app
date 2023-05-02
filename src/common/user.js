import { userStore } from "../store/user";
import { AWS_DATA } from '../common/constants';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export const getAuthDetails = (name, pwd) => {
    return new AuthenticationDetails({
        Username: name,
        Password: pwd
    });
};

export const POOL_DATA = {
    UserPoolId: AWS_DATA.USER_POOL_ID,
    ClientId: AWS_DATA.CLIENT_ID,
};

export const getUserPool = () => {
    return new CognitoUserPool(POOL_DATA);
};

export const getCognitoUser = (name, userPool) => {
    return new CognitoUser({
        Username: name,
        Pool: userPool
    })
};

export const authenticateUser = (result) => {
    userStore.authenticate();
    const accessToken = result.getAccessToken().getJwtToken();
    const refreshToken = result.getRefreshToken().getToken();
    cookies.set('accessToken', accessToken);
    cookies.set('refreshToken', refreshToken);
};

export const isSessionValid = async () => {
    return new Promise((resolve, reject) => {
        const poolData = POOL_DATA;
        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    reject(err)
                }
                resolve(session.isValid());
            });
        }
    })
}

export const updateLoggedInUser = async () => {
    const poolData = POOL_DATA;
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    try {
        const validSession = await isSessionValid();
        if (validSession) {
            userStore.setUser(cognitoUser);
            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    // Handle error
                } else {
                    userStore.setUserInfo(getAttrObj(attributes));
                }
            });
        } else {
            userStore.logout();
        }
    } catch {
        userStore.logout();
    }
}

const getAttrObj = (attrs) => {
    let attrObj = {};
    for (const attr of attrs) {
        attrObj[attr.Name] = attr.Value;
    }
    return attrObj;
}