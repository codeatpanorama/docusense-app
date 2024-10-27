<template>
  <div class="login-wrapper">
    <div class="lo-header">
      <div class="lo-header-text">User Login</div>
    </div>
    <div class="lo-content">
      <div class="lo-user-info" v-if="!unconfirmedUser">
        <div class="lo-username">
          <v-text-field
            label="Email ID"
            v-model="username"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-icon="mdi-at"
          ></v-text-field>
        </div>
        <div class="lo-password">
          <v-text-field
            v-model="password"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-icon="mdi-lock"
            :rules="[rules.required]"
            :type="showPwd ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            @click:append="showPwd = !showPwd"
          ></v-text-field>
        </div>
        <div class="lo-footer">
          <div class="lo-signup">
            <RouterLink to="/signup/">New User</RouterLink>
          </div>
          <div class="lo-forgot">
            <RouterLink to="/forgot-password/">Forgot Password?</RouterLink>
          </div>
          <div class="lo-btn">
            <v-btn :disabled="!(username && password)" density="default" @click="onLogin">
              Login
            </v-btn>
          </div>
        </div>
      </div>
      <div class="lo-unconfirmed-user" v-if="unconfirmedUser">
        <div class="lo-email-icon">
          <v-icon size="xxx-large" icon="mdi-email-open"></v-icon>
        </div>
        <div class="lo-code-message mb-2">
          Please enter the verification code that was sent to {{ username }}
        </div>
        <div class="lo-code mb-2">
          <v-otp-input
            label="Confirmation Code"
            v-model="otp"
            :rules="[rules.required]"
            prepend-icon="mdi-form-text-password"
          ></v-otp-input>
        </div>
        <div class="lo-footer lo-confirm">
          <div class="lo-btn">
            <v-btn density="default" @click="resendOTP"> Resend OTP </v-btn>
          </div>
          <div class="lo-btn ml-2">
            <v-btn :disabled="!otp" density="default" @click="confirmOTP"> Confirm OTP </v-btn>
          </div>
        </div>
      </div>
      <div class="lo-response" v-if="response">
        <v-alert :text="response.text" :type="response.type" closable></v-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuthDetails, getCognitoUser, getUserPool, authenticateUser } from '../common/user'
import { userStore } from '../store/user'
import { VALIDATION_RULES } from '../common/helpers'

const RESPONSES = {
  SUCCESS: () => ({
    type: 'success',
    text: `Logged in successfully`
  }),
  OTP_SUCCESS: () => ({
    type: 'success',
    text: `Account successfully verified! Please log in.`
  }),
  OTP_SENT: () => ({
    type: 'info',
    text: `OTP sent via email`
  }),
  FAILURE: (err) => ({
    type: 'error',
    text: err || `Invalid credentials`
  })
}

const SUCCESS_TIMER = 3000
const FAIL_TIMER = 5000

export default {
  data: () => ({
    processing: false,
    cognitoUser: null,
    username: '',
    password: '',
    showPwd: false,
    otp: '',
    unconfirmedUser: false,
    response: '',
    rules: {
      required: VALIDATION_RULES.REQUIRED,
      email: VALIDATION_RULES.EMAIL
    }
  }),
  mounted() {
    if (userStore.getState().isAuthenticated) {
      this.afterLogin()
    }
  },
  methods: {
    onLogin() {
      if (!this.processing && this.username && this.password) {
        this.processing = true
        // Perform login success
        const authDetails = getAuthDetails(this.username, this.password)
        const userPool = getUserPool()
        this.cognitoUser = getCognitoUser(this.username, userPool)
        this.cognitoUser.authenticateUser(authDetails, {
          onSuccess: (result) => {
            authenticateUser(result)
            this.processing = false
            this.response = RESPONSES.SUCCESS()
            setTimeout(() => {
              this.response = null
              this.afterLogin()
            }, SUCCESS_TIMER)
          },

          onFailure: (err) => {
            this.processing = false
            if (err.code === 'UserNotConfirmedException') {
              this.unconfirmedUser = true
              this.resendOTP()
              return
            }
            this.response = RESPONSES.FAILURE()
            console.log(err)
            setTimeout(() => {
              this.response = null
            }, FAIL_TIMER)
          }
        })
      }
    },
    confirmOTP() {
      this.cognitoUser.confirmRegistration(this.otp, true, (err, result) => {
        if (err) {
          const errMsg = err.message || JSON.stringify(err)
          this.response = RESPONSES.FAILURE(errMsg)
          console.log(errMsg)
          setTimeout(() => {
            this.response = null
          }, FAIL_TIMER)
          return
        }
        this.response = RESPONSES.OTP_SUCCESS()
        setTimeout(() => {
          this.response = null
          this.unconfirmedUser = false
        }, SUCCESS_TIMER)
      })
    },
    resendOTP() {
      this.cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          const errMsg = err.message || JSON.stringify(err)
          this.response = RESPONSES.FAILURE(errMsg)
          console.log(errMsg)
          setTimeout(() => {
            this.response = null
          }, FAIL_TIMER)
          return
        }

        this.response = RESPONSES.OTP_SENT()
        setTimeout(() => {
          this.response = null
        }, SUCCESS_TIMER)
      })
    },
    afterLogin() {
      this.$router.push(`/`)
    }
  }
}
</script>
<style lang="scss">
@use '../assets/media.scss';

.login-wrapper {
  border: 2px solid var(--color-border-subtle);
  border-radius: 8px;
  width: 400px;
  overflow: hidden;

  @include media.for-phone-only {
    width: 96%;
  }

  .lo-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);

    .lo-header-text {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .lo-content {
    padding: 12px;
    color: #000;

    .lo-footer {
      display: flex;
      place-content: space-between;
      place-items: flex-end;
      &.lo-confirm {
        place-content: flex-end;
      }

      .lo-btn {
        text-align: right;
      }
    }
    .lo-email-icon {
      text-align: center;
    }

    .lo-response {
      margin-top: 8px;
    }
  }
}
</style>
