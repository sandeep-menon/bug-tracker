<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" xs="12" class="secondary">
        <v-container fluid class="white--text">
          <div class="text-h4">Welcome, {{ user.name }}</div>
          <div class="text--primary">Today is {{ new Date().toDateString() }}</div>
          <v-divider class="mb-6"></v-divider>
          <div class="text--secondary">You have 3 defects and 2 tasks in pending...</div>
        </v-container>
      </v-col>
      <v-col cols="12" md="6" xs="12" class="accent">
        fancy pie chart
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" xs="12" class="accent">
        In progress
      </v-col>
      <v-col cols="12" md="6" xs="12" class="accent">
        My todos
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: "Dashboard",
    data: () => ({
        user: {}
    }),
    async created() {
      if(sessionStorage.token != "" && sessionStorage.token != undefined) {
        this.user = {
          name: sessionStorage.name,
          email: sessionStorage.email,
        }
      } else {
        this.$router.push({ name: "Login", params: {type: "error", message: "Please login first!" }})
      }
    }
}
</script>

<style>

</style>