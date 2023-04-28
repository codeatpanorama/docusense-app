<template>
    <div class="login-wrapper">
        <div class="lo-header">
            <div class="lo-header-text">User Login</div>
        </div>
        <div class="lo-content">
            <div class="lo-username">
                <v-text-field label="Username" v-model="username" :rules="[rules.required]"
                    prepend-icon="mdi-account"></v-text-field>
            </div>
            <div class="lo-password">
                <v-text-field v-model="password" :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'" prepend-icon="mdi-lock"
                    :rules="[rules.required]" :type="showPwd ? 'text' : 'password'" name="input-10-1" label="Password"
                    @click:append="showPwd = !showPwd"></v-text-field>
            </div>
            <div class="lo-btn">
                <v-btn :disabled="!(username && password)" density="default" @click="onLogin">
                    Login
                </v-btn>
            </div>
            <div class="lo-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
        </div>
    </div>
</template>
<script>
import { AWS_DATA } from '../common/constants';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import { userStore } from '../store/user';

const RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: `Logged in successfully`
    }),
    FAILURE: (err) => ({
        type: "error",
        text: `Invalid credentials`
    })
}

const SUCCESS_TIMER = 2000;
const FAIL_TIMER = 5000;

export default {
    data: () => ({
        processing: false,
        username: '',
        password: '',
        showPwd: false,
        response: '',
        rules: {
            required: value => !!value || 'Required.'
        }
    }),
    mounted() {
        if (this.$cookies.get("accessToken")) {
            this.afterLogin();
        }
    },
    methods: {
        onLogin() {
            if (!this.processing && this.username && this.password) {
                this.processing = true;
                // Perform login success
                const authDetails = new AuthenticationDetails({
                    Username: this.username,
                    Password: this.password
                });
                const userPool = new CognitoUserPool({
                    UserPoolId: AWS_DATA.USER_POOL_ID,
                    ClientId: AWS_DATA.CLIENT_ID,
                });
                const cognitoUser = new CognitoUser({
                    Username: this.username,
                    Pool: userPool
                })
                cognitoUser.authenticateUser(authDetails, {
                    onSuccess: (result) => {
                        userStore.authenticate();
                        const accessToken = result.getAccessToken().getJwtToken();
                        const refreshToken = result.getRefreshToken().getToken();
                        this.processing = false;
                        this.response = RESPONSES.SUCCESS();
                        this.$cookies.set('accessToken', accessToken);
                        this.$cookies.set('refreshToken', refreshToken);
                        setTimeout(() => {
                            this.response = null;
                            this.afterLogin();
                        }, SUCCESS_TIMER)
                    },

                    onFailure: (err) => {
                        this.processing = false;
                        this.response = RESPONSES.FAILURE();
                        console.log(err);
                        setTimeout(() => {
                            this.response = null;
                        }, FAIL_TIMER)
                    },
                });
            }
        },
        afterLogin() {
            this.$router.push(`/`);
        }
    },
}
</script>
<style lang="scss">
.login-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    min-width: 400px;
    overflow: hidden;
    
    @include for-phone-only {
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

        .lo-btn {
            text-align: right;
        }

        .lo-response {
            margin-top: 8px;
        }
    }
}</style>