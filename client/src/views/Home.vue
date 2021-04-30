<template>
  <v-container fluid style="height: 60vh">
    <v-container style="height: 90%;">
      <v-row>
        <v-col cols="12" md="6" xs="12" align-self="center" class="pa-5 text-center">
          <div class="text-h2 app-landing-hero-text">Welcome to <span class="primary--text">Bug Tracker</span></div>
          <div class="mt-6 text-h6 text--secondary">
            A capstone project of a full stack web application
          </div>
          <v-row class="mt-6">
            <v-spacer></v-spacer>
            <v-col>
              <v-btn color="primary" outlined large><v-icon class="mr-2">mdi-login</v-icon>Login</v-btn>
            </v-col>
            <v-col>
              <v-btn color="primary" outlined large><v-icon class="mr-2">mdi-account-plus</v-icon>Register</v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" xs="12" align-self="end" class="pa-5 app-landing-hero-image text-center d-none d-md-block">
          <img src="../assets/undraw_Floating_re_xtcj.svg" alt="" width="50%">
        </v-col>
      </v-row>
    </v-container>
      
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center text-h4 text--secondary">
          <v-card class="mx-auto pt-10" max-width="1024">
            <v-img class="white--text align-end" height="200px" contain src="../assets/undraw_my_personal_files_8krs.svg"></v-img>

            <v-card-title style="justify-content: center;">Tech Stack</v-card-title>

            <v-card-text class="text--primary">
              <div><b>NodeJS</b> application environment</div>
              <div><b>Express REST API</b> backend server</div>
              <div>Cloud hosted <b>MongoDB</b> database</div>
              <div>Server routes to <b>C</b>reate, <b>R</b>ead, <b>U</b>pdate and <b>D</b>elete</div>
              <div><b>VueJS</b> front-end with <b>VuetifyJS</b></div>
              <div>Authentication and authorization with <b>JWT</b></div>
              <div>Password encrpytion with <b>bcryptjs</b></div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="viewSourceCode()"><v-icon class="mr-2">mdi-github</v-icon>View Source Code</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </v-container>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      viewSourceCode() {
        window.open("https://github.com/sandeep-menon/bug-tracker");
      },
    },
  }
</script>

<style scoped>
.container.container--fluid {
  background-image: url("../assets/background-wave.svg");
  background-size: cover;
}
.app-landing-hero-text {
  text-shadow: #dfdfdf 0.1em 0.1em 0.1em;
}
</style>
