<template>
  <v-container>
      <div>{{this.user}}</div>
  </v-container>
</template>

<script>
import API from "../api";
export default {
    name: "Users",
    data: () => ({
        user: ""
    }),
    async created() {
        let token = this.$store.state.token || sessionStorage.token;
        let loginData = {
            token: token,
        }
        let response = await API.getAllUsers(loginData);
        
        if(response.type == "success") {
            this.user = response.message;
        } else if(response.type == "error") {
            this.$router.push({ name: "Login", params: {type: response.type, message: response.message} });
        }
    }
}
</script>

<style>

</style>