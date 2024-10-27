<template>
    <div class="change-password-wrapper">
        <div class="cp-header">
            <div class="cp-header-text">Change Password</div>
        </div>
        <div class="cp-content">
            <div class="cp-password-old">
                <v-text-field v-model="oldPassword" :append-icon="showOldPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-minus" :rules="[rules.required]" :type="showOldPwd ? 'text' : 'password'"
                    name="input-10-1" label="Old Password" @click:append="showOldPwd = !showOldPwd"></v-text-field>
            </div>
            <div class="cp-password-new">
                <v-text-field v-model="newPassword" :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-plus" :rules="[rules.required]" :type="showNewPwd ? 'text' : 'password'"
                    name="input-10-1" label="New Password" @click:append="showNewPwd = !showNewPwd"></v-text-field>
            </div>
            <div class="cp-btn">
                <v-btn :disabled="!(oldPassword && newPassword)" density="default" @click="onUpdateClick">
                    UPDATE
                </v-btn>
            </div>
            <div class="cp-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
        </div>
    </div>
</template>
<script>
import { getCognitoUser } from '../common/user';

const RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: `Password updated successfully`
    }),
    FAILURE: (err) => ({
        type: "error",
        text: err || `Please try again`
    })
}

const SUCCESS_TIMER = 2000;
const FAIL_TIMER = 7000;

export default {
    data: () => ({
        processing: false,
        oldPassword: '',
        newPassword: '',
        showOldPwd: false,
        showNewPwd: false,
        response: '',
        rules: {
            required: value => !!value || 'Required.'
        }
    }),
    methods: {
        onUpdateClick() {
            if (!this.processing && this.oldPassword && this.newPassword) {
                this.processing = true;
                this.changePassword();
            }
        },
        async changePassword() {
            //const validSession = await isSessionValid();
            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            const user = getCognitoUser();
            user.getSession((err, session) => {
                user.changePassword(this.oldPassword, this.newPassword, (err, result) => {
                    this.processing = false;
                    if (err) {
                        const errMsg = (err.message || JSON.stringify(err));
                        this.response = RESPONSES.FAILURE(errMsg);
                        setTimeout(() => {
                            this.response = null;
                        }, FAIL_TIMER)
                        return;
                    }
                    this.response = RESPONSES.SUCCESS();
                    setTimeout(() => {
                        this.response = null;
                        this.afterPasswordChange();
                    }, SUCCESS_TIMER)
                })
            })
        },
        afterPasswordChange() {
            this.$router.push(`/`);
        },
    },
}
</script>
<style lang="scss">
@use '../assets/media.scss';

.change-password-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    width: 400px;
    overflow: hidden;

    @include media.for-phone-only {
        width: 96%;
    }

    .cp-header {
        background: var(--color-title-bg);
        color: var(--color-title-text);
        padding: 12px;
        border-bottom: 2px solid var(--color-border-subtle);

        .cp-header-text {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .cp-content {
        padding: 12px;
        color: #000;

        .cp-btn {
            text-align: right;
        }

        .cp-response {
            margin-top: 8px;
        }
    }
}
</style>