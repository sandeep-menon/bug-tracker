<template>
    <v-container>
        <v-alert :type="this.alertType" border="left" dismissible v-if="this.alertMessage">{{ this.alertMessage }}</v-alert>
        <v-card outlined>
            <v-overlay :opacity="0.6" :value="loading">
                <v-progress-circular indeterminate size="32" color="accent"></v-progress-circular>
                <span class="ml-6 text--accent">Loading...</span>
            </v-overlay>
            <v-card-title>My Profile</v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle class="text-right">{{ user.id }}</v-card-subtitle>
            <v-card-text>
                <v-form>
                    <v-text-field label="Full name" v-model="user.name"></v-text-field>
                    <v-text-field label="Email address" v-model="user.email"></v-text-field>
                    <v-text-field label="Role" v-model="user.role"></v-text-field>
                    <v-textarea outlined label="About me" v-model="user.about" :counter="1000"></v-textarea>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="updateUser"><v-icon class="mr-2">mdi-floppy</v-icon>Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import API from '../api';
export default {
    data: () => ({
        user: {},
        alertType: "",
        alertMessage: "",
        loading: true
    }),
    async created() {
        let token = this.$store.state.token || sessionStorage.token;
        let loginData = {
            token: token,
        }
        let response = await API.getMyProfile(loginData);
        
        if(response.type == "success") {
            this.user = response.userData;
            this.loading = false;
        } else if(response.type == "error") {
            this.$router.push({ name: "Login", params: {type: response.type, message: response.message} });
        }
    },

    methods: {
        async updateUser() {
            this.loading = true;
            let token = this.$store.state.token || sessionStorage.token;

            let loginData = {
                token: token,
                updatedUser: {
                    id: this.user.id,
                    name: this.user.name,
                    email: this.user.email,
                    role: this.user.role,
                    about: this.user.about
                }
            }

            let response = await API.updateUserById(loginData);

            if(response.type == "success") {
                this.alertType = response.type;
                this.alertMessage = response.message;
                this.loading = false;
            } else if (response.type == "error") {
                this.alertType = response.type;
                this.alertMessage = response.message;
                this.loading = false;
            }
        }
    }
}
</script>

<style>

</style>