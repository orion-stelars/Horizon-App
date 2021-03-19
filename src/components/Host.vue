<template>
  <v-dialog :value="!host" width="700" persistent>
    <v-card>
      <v-card-title>
        {{ $t("Host") }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-form ref="formRef" v-model="isValid" style="width: 100%">
            <v-col class="pb-0" cols="12">
              <v-text-field
                v-model="input"
                :rules="[v => !!v || '']"
                :placeholder="`${$t('Server')} ${$t('Address')}`"
                append-icon="mdi-server"
                outlined
                @keydown.enter="submit"
              />
            </v-col>
          </v-form>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :loading="isLoading" color="primary" depressed @click="submit">
          {{ $t("Add") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Host",
  mounted() {
    this.getHost();
  },
  data() {
    return {
      host: null,
      input: "",
      isValid: false,
      isLoading: false
    };
  },
  watch: {
    host(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getHost() {
      this.host = localStorage.getItem("host");
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
      localStorage.setItem("host", this.input);
      this.isLoading = false;
      window.location.href = "/";
    }
  }
};
</script>

<style lang="css" scoped></style>
<i18n>
  {
    "en": {
      "Host": "Host",
      "Address": "Address",
      "Server": "Server"
    },
    "ar": {
      "Host": "بيانات المضيف",
      "Address": "عنوان",
      "Server": "الخدم"
    }
  }
</i18n>
