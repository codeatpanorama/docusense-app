<template>
    <div class="forgot-password-wrapper">
        <div class="fp-header">
            <div class="fp-header-text">Forgot Password</div>
        </div>
        <div class="fp-content">
            <div class="fp-username">
                <v-text-field label="Username" v-model="username" type="email" :rules="[rules.required, rules.email]"
                    prepend-icon="mdi-account" @change="resetCodeDelivery"></v-text-field>
            </div>
            <div class="fp-code-section">
                <div class="fp-code-feedback" :class="`feedback-${codeDelivery.type}`" v-if="codeDelivery">{{
                    codeDelivery.text }}</div>
                <div class="fp-btn fp-code-btn">
                    <v-btn :disabled="!username" density="default" @click="onGetCodeClick">
                        GET CODE
                    </v-btn>
                </div>
            </div>
            <div class="fp-code">
                <v-text-field label="Code" v-model="code" type="number" :rules="[rules.required]"
                    prepend-icon="mdi-email-newsletter"></v-text-field>
            </div>
            <div class="fp-password-new">
                <v-text-field v-model="newPassword" :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-plus" :rules="[rules.required]" :type="showNewPwd ? 'text' : 'password'"
                    name="input-10-1" label="New Password" @click:append="showNewPwd = !showNewPwd"></v-text-field>
            </div>
            <div class="fp-footer">
                <div class="fp-login">
                    <RouterLink to="/login/">Login?</RouterLink>
                </div>
                <div class="fp-btn">
                    <v-btn :disabled="!(code && newPassword)" density="default" @click="onUpdateClick">
                        UPDATE
                    </v-btn>
                </div>
            </div>
            <div class="fp-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
        </div>
    </div>
</template>
<script>
import { getCognitoUser } from '../common/user';
import { VALIDATION_RULES } from '../common/helpers';

const RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: "Password updated successfully"
    }),
    FAILURE: (err) => ({
        type: "error",
        text: err || "Please try again"
    })
}

const CODE_RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: "Verification Code sent to Email"
    }),
    FAILURE: (err) => ({
        type: "error",
        text: err || "Please try again"
    })
}

const SUCCESS_TIMER = 2000;
const FAIL_TIMER = 7000;

export default {
    data: () => ({
        processing: false,
        username: '',
        code: '',
        newPassword: '',
        showNewPwd: false,
        codeDelivery: null,
        response: null,
        cognitoUser: null,
        rules: {
            required: VALIDATION_RULES.REQUIRED,
            email: VALIDATION_RULES.EMAIL
        }
    }),
    methods: {
        onGetCodeClick() {
            this.codeDelivery = null;
            this.cognitoUser = getCognitoUser(this.username);
            this.cognitoUser.forgotPassword({
                onSuccess: (data) => {
                    // successfully initiated reset password request
                    this.codeDelivery = CODE_RESPONSES.SUCCESS();
                },
                onFailure: (err) => {
                    const errMsg = (err.message || JSON.stringify(err));
                    this.codeDelivery = CODE_RESPONSES.FAILURE(errMsg);
                },
            });
        },
        onUpdateClick() {
            if (!this.processing && this.code && this.newPassword) {
                this.processing = true;
                this.resetPassword();
            }
        },
        resetCodeDelivery() {
            this.codeDelivery = null;
        },
        resetPassword() {
            this.cognitoUser.confirmPassword(this.code, this.newPassword, {
                onSuccess: () => {
                    this.processing = false;
                    this.response = RESPONSES.SUCCESS();
                    setTimeout(() => {
                        this.response = null;
                        this.afterPasswordReset();
                    }, SUCCESS_TIMER)
                },
                onFailure: (err) => {
                    this.processing = false;
                    const errMsg = (err.message || JSON.stringify(err));
                    this.response = RESPONSES.FAILURE(errMsg);
                    setTimeout(() => {
                        this.response = null;
                    }, FAIL_TIMER)
                }
            })
        },
        afterPasswordReset() {
            this.$router.push(`/login/`);
        },
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.forgot-password-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    width: 400px;
    overflow: hidden;

    @include for-phone-only {
        width: 96%;
    }

    .fp-header {
        background: var(--color-title-bg);
        color: var(--color-title-text);
        padding: 12px;
        border-bottom: 2px solid var(--color-border-subtle);

        .fp-header-text {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .fp-content {
        padding: 12px;
        color: #000;

        .fp-code-section {
            display: flex;
            place-content: space-between;
            place-items: center;
            margin-bottom: 16px;

            .fp-code-feedback {
                font-size: 12px;
                color: green;
                margin-left: 40px;
            }

            .fp-btn {
                flex-grow: 1;
            }
        }

        .fp-footer {
            display: flex;
            place-content: space-between;
            place-items: flex-end;
        }

        .fp-btn {
            text-align: right;
        }

        .fp-response {
            margin-top: 8px;
        }
    }
}
</style>