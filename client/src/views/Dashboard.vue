<template>
  <v-container style="height: 100%;">
    <v-row style="height: 50%;">
      <v-col cols="12" md="6" xs="12">Welcome message</v-col>
      <v-col cols="12" md="6" xs="12">Fancy pie chart</v-col>
    </v-row>
    <v-row style="height: 50%;">
      <v-col cols="12" md="6" xs="12">In progress tasks</v-col>
      <v-col cols="12" md="6" xs="12">My todos</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: "Dashboard",
    data: () => ({

    }),
    // async created() {
    //     let token = this.$store.state.token || sessionStorage.token;

    // }
}
</script>

<style>

</style>