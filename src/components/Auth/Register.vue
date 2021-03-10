<template>
  <v-card>
    <v-card-title>{{ $t("Register") }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-form ref="formRef" v-model="isValid" style="width: 100%">
          <v-col class="pb-0" cols="12">
            <v-text-field
              v-model="input.name"
              :rules="rules.name"
              append-icon="mdi-account"
              :placeholder="$t('name')"
              outlined
              @keydown.enter="submit"
            />
          </v-col>
          <v-col class="pb-0" cols="12">
            <v-text-field
              v-model="input.email"
              :rules="rules.email"
              :loading="isEmailLoading"
              append-icon="mdi-email"
              type="email"
              :placeholder="$t('email')"
              outlined
              @keydown.enter="submit"
              @keydown="validateEmail"
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
            <v-text-field
              v-model="confirmPassword"
              :rules="rules.confirmPassword"
              append-icon="mdi-lock"
              :placeholder="$t('confirm password')"
              type="password"
              outlined
              @keyup.enter="submit"
            />
          </v-col>
          <v-col class="py-0" cols="12">
            <v-btn text @click="changeMood">
              {{ $t("already have an account?") }} {{ $t("Login") }}
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
        >{{ $t("Register") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Register",

  data() {
    return {
      showDialog: false,
      isValid: false,
      isEmailLoading: false,
      confirmPassword: "",
      input: {
        email: "",
        password: ""
      },
      isValidEmail: true,
      error: null,
      hasError: false,
      isLoading: false
    };
  },
  computed: {
    rules() {
      return {
        password: [
          v => !!v || this.$t("password is required"),
          v =>
            (v && v.length >= 8) ||
            this.$t("password must be greater than 8 characters")
        ],
        confirmPassword: [
          v => !!v || this.$t("password is required"),
          v =>
            (v && v.length >= 8) ||
            this.$t("password must be greater than 8 characters"),
          v =>
            v === this.input.password || this.$t("passwords must be identical")
        ],
        name: [
          v => !!v || this.$t("name is required"),
          v =>
            (v && v.length >= 5) ||
            this.$t("name must be greater than 5 characters")
        ],
        email: [
          v => !!v || this.$t("email is required"),
          v => /.+@.+\..+/.test(v) || this.$t("email must be valid"),
          () => this.isValidEmail || this.$t("This Email Already Exists")
        ]
      };
    }
  },
  methods: {
    changeMood() {
      this.$emit("change-mood");
    },
    async checkValidEmail(email) {
      try {
        await this.$axios({
          url: "/users/email/available",
          method: "get",
          params: { email }
        });
        return true;
      } catch (err) {
        return false;
      }
    },
    async validateEmail(event) {
      setTimeout(async () => {
        this.isEmailLoading = true;
        this.isValidEmail = await this.checkValidEmail(event.target.value);
        this.isEmailLoading = false;
        this.$refs.formRef.validate();
      }, 100);
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
        .post("/users", this.input)
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
<i18n>
  {
    "en": {
     "confirm password": "Confirm Password",
     "passwords must be identical": "Passwords must be identical",
     "name must be greater than 5 characters": "Name must be greater than 5 characters",
     "This Email Already Exists": "This Email Already Exists"
   },
   "ar": {
      "confirm password": "تاكيد كلمة المرور",
      "passwords must be identical": "كلمات المرور يجب ان تكون متطابقه",
      "name must be greater than 5 characters": "الاسم لابد ان يزيد عم ٥ حروف",
      "This Email Already Exists": "هذا البريد الالكتروني موجود بالفعل"
    }
  }
</i18n>
<style lang="css" scoped></style>
