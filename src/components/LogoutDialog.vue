<template>
    <v-dialog v-model="showDialog" width="auto">
        <template v-slot:activator="{ props }">
            <div class="logout-trigger" color="primary" v-bind="props">
                Logout
            </div>
        </template>
        <v-card>
            <v-card-title>LOGOUT</v-card-title>
            <v-divider></v-divider>
            <v-card-text>Are you sure you want to logout?</v-card-text>
            <v-card-actions>
                <v-btn color="blue-darken-1" variant="text" @click="logout">
                    YES
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                    CANCEL
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { userStore } from '../store/user';
export default {
    props: {
    },
    data: () => ({
        showDialog: false
    }),
    mounted() {
    },
    methods: {
        logout() {
            userStore.logout();
            this.showDialog = false;
            this.$cookies.remove("accessToken");
            this.$cookies.remove("refreshToken");
            this.$router.push(`/login/`);
        },
        close() {
            this.showDialog = false;
        }
    },
}
</script>
<style lang="scss">
.logout-trigger {
    padding: 0 20px;
    cursor: pointer;
    &:hover {
        background: rgba(0,0,0,0.12);
    }
}

</style>