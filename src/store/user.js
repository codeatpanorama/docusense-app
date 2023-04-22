import { Store } from "./base";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();


class UserStore extends Store {
  data() {
    return {
      isAuthenticated: null
    }
  }

  setup(data) {
    data.isAuthenticated = !!cookies.get("accessToken");
  }

  authenticate() {
    this.state.isAuthenticated = true;
  }

  logout() {
    this.state.isAuthenticated = false;
  }
}

export const userStore = new UserStore()
