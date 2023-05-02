import { Store } from "./base";
import { isSessionValid } from '../common/user';
import { useCookies } from "vue3-cookies";
import { POOL_DATA } from "../common/user";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const { cookies } = useCookies();


class UserStore extends Store {
  data() {
    return {
      isAuthenticated: null,
      user: null,
      userInfo: null,
      userPool: null,
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

  async checkSessionValidity() {
    this.state.isAuthenticated = await isSessionValid();
  }

  logout() {
    this.state.isAuthenticated = false;
    this.state.user = null;
    this.state.userInfo = null;
  }
}

export const userStore = new UserStore()
userStore.checkSessionValidity();
