<template>
  <div></div>
</template>

<script>
export default {
    created() {
        this.$store.dispatch("logoutUser");
        this.$router.push({ name: "Home" });
    }
}
</script>

<style>

</style>