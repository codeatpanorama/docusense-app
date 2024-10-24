<template>
  <div class="signup-wrapper">
    <div class="signup-header">
      <div class="signup-header-text">New User Registration</div>
    </div>
    <div class="signup-content">
      <div class="signup-step-1" v-if="!step1Complete">
        <div class="signup-full-name">
          <v-text-field
            label="Name"
            v-model="userName"
            :rules="[rules.required]"
            prepend-icon="mdi-account"
          ></v-text-field>
        </div>
        <div class="signup-username">
          <v-text-field
            label="Email ID"
            v-model="userEmail"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-icon="mdi-at"
          ></v-text-field>
        </div>
        <div class="signup-password">
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
        <div class="signup-footer">
          <div class="signup-login">
            <RouterLink to="/login/">Existing User Login</RouterLink>
          </div>
          <div class="signup-btn">
            <v-btn
              :disabled="!(userName && userEmail && password)"
              density="default"
              @click="onSignUp"
            >
              Sign Up
            </v-btn>
          </div>
        </div>
      </div>
      <div class="signup-step-2" v-if="step1Complete">
        <div class="signup-email-icon">
          <v-icon size="xxx-large" icon="mdi-email-open"></v-icon>
        </div>
        <div class="signup-code-message mb-2">
          Please enter the verification code that was sent to {{ userEmail }}
        </div>
        <div class="signup-code mb-2">
          <v-otp-input
            label="Confirmation Code"
            v-model="otp"
            :rules="[rules.required]"
            prepend-icon="mdi-form-text-password"
          ></v-otp-input>
        </div>
        <div class="signup-footer signup-confirm">
          <div class="signup-btn">
            <v-btn density="default" @click="resendOTP"> Resend OTP </v-btn>
          </div>
          <div class="signup-btn ml-2">
            <v-btn :disabled="!otp" density="default" @click="confirmOTP"> Confirm OTP </v-btn>
          </div>
        </div>
      </div>
      <div class="signup-response" v-if="response">
        <v-alert :text="response.text" :type="response.type" closable></v-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserPool } from '../common/user'
import { userStore } from '../store/user'
import { VALIDATION_RULES } from '../common/helpers'

const RESPONSES = {
  SUCCESS: () => ({
    type: 'success',
    text: `Signed up successfully`
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
    text: err || `Invalid input`
  })
}

const SUCCESS_TIMER = 3000
const FAIL_TIMER = 5000

export default {
  data: () => ({
    processing: false,
    cognitoUser: null,
    userName: '',
    userEmail: '',
    password: '',
    showPwd: false,
    otp: '',
    response: '',
    step1Complete: false,
    rules: {
      required: VALIDATION_RULES.REQUIRED,
      email: VALIDATION_RULES.EMAIL
    }
  }),
  mounted() {
    if (userStore.getState().isAuthenticated) {
      this.alreadySignedUp()
    }
  },
  methods: {
    onSignUp() {
      if (!this.processing && this.userName && this.userEmail && this.password) {
        this.processing = true
        // Perform login success
        const attributeList = []
        const dataName = {
          Name: 'name',
          Value: this.userName
        }
        // attributeList.push(dataName)
        const userPool = getUserPool()
        userPool.signUp(this.userEmail, this.password, attributeList, null, (err, result) => {
          this.processing = false
          if (err) {
            const errMsg = err.message || JSON.stringify(err)
            console.log(errMsg)
            this.response = RESPONSES.FAILURE(errMsg)
            setTimeout(() => {
              this.response = null
            }, FAIL_TIMER)
            return
          }
          this.cognitoUser = result.user
          this.step1Complete = true
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
          this.$router.push(`/login/`)
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
    alreadySignedUp() {
      this.$router.push(`/`)
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.signup-wrapper {
  border: 2px solid var(--color-border-subtle);
  border-radius: 8px;
  width: 400px;
  overflow: hidden;

  @include for-phone-only {
    width: 96%;
  }

  .signup-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);

    .signup-header-text {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .signup-content {
    padding: 12px;
    color: #000;

    .signup-footer {
      display: flex;
      place-content: space-between;
      place-items: flex-end;
      &.signup-confirm {
        place-content: flex-end;
      }
      .signup-btn {
        text-align: right;
      }
    }
    .signup-email-icon {
      text-align: center;
    }

    .signup-response {
      margin-top: 8px;
    }
  }
}
</style>
