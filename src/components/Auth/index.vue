<template>
  <div>
    <v-btn v-if="auth" @click="logout" outlined>
      {{ auth.name }} | Logout
    </v-btn>
    <v-btn v-else outlined @click="toggleDialog">{{ mode }}</v-btn>
    <v-dialog v-if="!auth" v-model="showDialog" closable width="700">
      <login
        v-if="mode === 'login'"
        @change-mood="mode = 'register'"
        @cancel="toggleDialog"
        @success="toggleDialog(true)"
      />
      <register
        v-else
        @change-mood="mode = 'login'"
        @cancel="toggleDialog"
        @success="toggleDialog(true)"
      />
    </v-dialog>
    <v-snackbar
      v-model="successMessage"
      v-if="auth"
      color="success"
      :timeout="5000"
      bottom
      app
    >
      <span v-if="auth">Welcome {{ auth.name }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import Login from "./Login";
import Register from "./Register";
export default {
  name: "Auth",
  components: {
    Login,
    Register
  },
  data() {
    return {
      mode: "login",
      showDialog: false,
      successMessage: false
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    auth() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.mode = "login";
      }
    }
  },
  methods: {
    init() {
      const localStorageData = this.getLocalStorage();
      if (localStorageData) {
        this.$store.dispatch("auth/setUser", localStorageData);
      }
    },
    getLocalStorage() {
      const localStorageData = localStorage.getItem("user");
      if (localStorageData) {
        return JSON.parse(localStorageData);
      } else return false;
    },
    toggleDialog(welcomeMessage = false) {
      this.showDialog = !this.showDialog;
      if (welcomeMessage) {
        this.successMessage = true;
      }
    },
    logout() {
      this.$store.dispatch("auth/logout");
    }
  }
};
</script>

<style lang="css" scoped></style>
