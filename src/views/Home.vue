<template>
  <div>
    <secertary-visits v-if="auth" />
  </div>
</template>

<script>
import SecertaryVisits from "@/components/secertary/Visits";
export default {
  name: "Home",
  components: {
    SecertaryVisits
  },
  data() {
    return {};
  },
  computed: {
    auth() {
      return this.$store.state.auth.user;
    },
    isClient() {
      return this.auth && this.auth.roles.indexOf("client") !== -1;
    }
  }
};
</script>

<style lang="css" scoped></style>
