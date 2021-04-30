<template>
    <v-container style="height: 100%;" class="pa-0">
        <v-row class="ma-0">
            <v-col cols="12" md="6" xs="12" class="d-none d-md-flex pa-0" style="height: 95vh;">
                <v-img src="../assets/jigsaw.svg" style="background-color: #f1f1e6;"></v-img>
            </v-col>
            <v-col cols="12" md="6" xs="12" class="d-flex d-md-none pa-0">
                <v-img src="../assets/jigsaw.svg" style="background-color: #f1f1e6; height:200px;"></v-img>
            </v-col>
            <v-col cols="12" md="6" xs="12" class="pa-5">
                <v-alert :type="this.alertType" border="left" dismissible v-if="this.alertMessage">{{ this.alertMessage }}</v-alert>
                <div class="text-h4 text--secondary mt-4 mb-4"><v-icon class="mr-2" large>mdi-login</v-icon>Login</div>
                <v-divider></v-divider>
                <v-container class="pa-0 mt-4">
                    <v-form ref="form" v-model="valid">
                        
                        <v-text-field label="Email address" v-model="loginData.email" :rules="rulesForUserEmail"></v-text-field>
                        <v-text-field label="Password" v-model="loginData.password" type="password" :rules="rulesForUserPass"></v-text-field>
                        <!-- <v-text-field label="Re-enter your password" v-model="userData.userPass2" type="password" :rules="rulesForUserPass2"></v-text-field> -->
                        <!-- <v-select label="Role" v-model="userData.userRole" :items="userRoles" :rules="rulesForUserRole"></v-select> -->
                        <!-- <p class="text-subtitle-2 text--secondary uppercase text-center">By registering, you agree to the <a @click="termsDialog = true;">terms of service</a>.</p> -->
                        <v-row class="mt-5 mb-5" style="justify-content: center;">
                            <v-btn color="primary" large @click="loginUser"><v-icon class="mr-2">mdi-login</v-icon>Login</v-btn>
                        </v-row>
                    </v-form>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "Login",
    data: () => ({
        alertType: "",
        alertMessage: "",
        valid: true,
        loginData: {
            email: "",
            password: ""
        }
    }),
    computed: {
        rulesForUserEmail: function() {
            return [
                value => !!value || "Required",
                value => value.length <=100 || "Maximum allowed length is 100",
                value => /.+@.+\..+/.test(value) || 'E-mail must be valid'
            ]
        },
        rulesForUserPass: function() {
            return [
                value => !!value || "Required"
            ]
        },
    },
    methods: {
        loginUser() {
            this.$refs.form.validate();
            if(this.valid) {
                this.alertType = "success";
                this.alertMessage = "submitting data";
            }
        }
    }
}
</script>