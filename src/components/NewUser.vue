<template>
    <div class="new-user-wrapper">
        <div class="nu-header">
            <div class="nu-header-text">Add New User</div>
        </div>
        <div class="nu-content">
            <div class="nu-username">
                <v-text-field label="Username" v-model="username" type="email" :rules="[rules.required, rules.email]"
                    prepend-icon="mdi-account"></v-text-field>
            </div>
            <div class="nu-btn">
                <v-btn :disabled="!username" density="default" @click="addUser">
                    ADD
                </v-btn>
            </div>
            <div class="nu-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
        </div>
    </div>
</template>
<script>
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { getCognitoUser, getUserPool } from '../common/user';

const RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: `User added successfully`
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
        username: '',
        response: '',
        rules: {
            required: value => !!value || 'Required.'
        }
    }),
    methods: {
        addUser() {
            if (!this.processing && this.username) {
                this.processing = true;
                this.addNewUser();
            }
        },
        addNewUser() {
            const userPool = getUserPool();

            let attributeList = [];

            const dataEmail = {
                Name: 'email',
                Value: this.username,
            };

            const attributeEmail = new CognitoUserAttribute(dataEmail);

            attributeList.push(attributeEmail);

            userPool.signUp('username', 'password', attributeList, null, (err, result) => {
                if (err) {
                    const errMsg = (err.message || JSON.stringify(err));
                    this.response = RESPONSES.FAILURE(errMsg);
                    setTimeout(() => {
                        this.response = null;
                    }, FAIL_TIMER)
                    return;
                }
                this.response = RESPONSES.SUCCESS();
                const cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());
                setTimeout(() => {
                    this.response = null;
                }, SUCCESS_TIMER)
            });
        },
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.new-user-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    width: 400px;
    overflow: hidden;

    @include for-phone-only {
        width: 96%;
    }

    .nu-header {
        background: var(--color-title-bg);
        color: var(--color-title-text);
        padding: 12px;
        border-bottom: 2px solid var(--color-border-subtle);

        .nu-header-text {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .nu-content {
        padding: 12px;
        color: #000;

        .nu-btn {
            text-align: right;
        }

        .nu-response {
            margin-top: 8px;
        }
    }
}
</style>