import { Store } from "./base";
import { getEntitlements, isSessionValid } from '../common/user';
import { POOL_DATA } from "../common/user";
import { CognitoUserPool } from "amazon-cognito-identity-js";

class UserStore extends Store {
  data() {
    return {
      isAuthenticated: null,
      user: null,
      userInfo: null,
      userPool: null,
      entitlements: null,
    }
  }

  setup(data) {
    data.userPool = new CognitoUserPool(POOL_DATA);
  }

  authenticate() {
    this.state.isAuthenticated = true;
  }

  setUser(user) {
    this.state.user = user;
  }

  setUserInfo(userInfo) {
    this.state.userInfo = userInfo;
  }

  setUserEntitlements(entitlements) {
    this.state.entitlements = entitlements;
  }

  async checkSessionValidity() {
    this.state.isAuthenticated = await isSessionValid();
  }

  logout() {
    this.state.user.signOut();
    this.state.isAuthenticated = false;
    this.state.user = null;
    this.state.userInfo = null;
    this.state.entitlements = null;
  }
}

export const userStore = new UserStore()
await userStore.checkSessionValidity();
if (userStore.getState().isAuthenticated) {
  await getEntitlements()
}