<template>
  <v-card>
    <v-card-title>{{ $t("Login") }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-form ref="formRef" v-model="isValid" style="width: 100%">
          <v-col class="pb-0" cols="12">
            <v-text-field
              v-model="input.email"
              :rules="rules.email"
              append-icon="mdi-email"
              type="email"
              :placeholder="$t('email')"
              outlined
              @keydown.enter="submit"
            />
          </v-col>
          <v-col class="py-0" cols="12">
            <v-text-field
              v-model="input.password"
              :rules="rules.password"
              append-icon="mdi-lock"
              :placeholder="$t('password')"
              type="password"
              outlined
              @keydown.enter="submit"
            />
          </v-col>
          <v-col class="py-0" cols="12">
            <v-btn text @click="changeMood">
              {{ $t("create an account") }}
            </v-btn>
          </v-col>
        </v-form>
      </v-row>
      <v-snackbar v-model="hasError" color="error" bottom :timeout="5000">
        {{ error }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="hasError = false">
            {{ $t("Close") }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" large depressed outlined @click="$emit('cancel')">{{
        $t("Cancel")
      }}</v-btn>
      <v-btn
        :loading="isLoading"
        color="primary"
        large
        depressed
        @click="submit"
        >{{ $t("Login") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      showDialog: false,
      isValid: false,
      input: {
        email: "",
        password: ""
      },
      error: null,
      hasError: false,
      isLoading: false,
      rules: {
        password: [
          v => !!v || this.$t("password is required"),
          v =>
            (v && v.length >= 8) ||
            this.$t("password must be greater than 8 characters")
        ],
        email: [
          v => !!v || this.$t("email is required"),
          v => /.+@.+\..+/.test(v) || this.$t("email must be valid")
        ]
      }
    };
  },
  methods: {
    changeMood() {
      this.$emit("change-mood");
    },
    submit() {
      // is loading
      this.isLoading = true;
      // validate
      this.$refs.formRef.validate();
      if (!this.isValid) {
        this.isLoading = false;
        return false;
      }
      // call api
      this.$axios
        .post("/auth", this.input)
        .then(res => {
          this.isLoading = false;
          this.$store.dispatch("auth/setUser", res.data);
          this.$emit("success");
          this.$socket.client.connect();
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response.status === 400) {
            this.error = this.$t("Invalid email or password");
          } else this.error = this.$t("somethingWrong");
          this.hasError = true;
        });
    }
  }
};
</script>

<style lang="css" scoped></style>
