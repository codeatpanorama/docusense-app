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
                <v-btn density="default" @click="onLogin">
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
import { APIS } from '../common/constants';
import axios from "axios";

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

const FEEDBACK_TIMER = 5000;

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

    methods: {
        onLogin() {
            if (!this.processing && this.username && this.password) {
                this.processing = true;
                // Perform login success
                setTimeout(() => {
                    this.processing = false;
                    this.response = RESPONSES.SUCCESS();
                    this.$router.push(`/`)
                })
                /*
                axios.post(APIS.LOGIN, {
                    username: this.username,
                    password: this.password
                }).then((resp) => {
                    this.processing = false;
                    this.response = RESPONSES.SUCCESS();
                    setTimeout(() => {
                        this.response = null;
                    }, FEEDBACK_TIMER)
                }).catch((err) => {
                    this.processing = false;
                    this.response = RESPONSES.FAILURE();
                    setTimeout(() => {
                        this.response = null;
                    }, FEEDBACK_TIMER)
                });
                */
            }
        },
    },
}
</script>
<style scoped>
.login-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    min-width: 400px;
    overflow: hidden;
}

.lo-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);
}

.lo-header-text {
    font-size: 16px;
    font-weight: bold;
}

.lo-content {
    padding: 12px;
    color: #000;
}

.lo-btn {
    text-align: right;
}

.lo-response {
    margin-top: 8px;
}
</style>