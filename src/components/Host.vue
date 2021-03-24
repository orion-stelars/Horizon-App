<template>
  <v-dialog v-model="showDialog" width="700" :persistent="persistent">
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
                :placeholder="$t('Server Address')"
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
    this.getHost(true);
    this.$root.$on("host-dialog", () => {
      this.showDialog = true;
      if (this.host) this.persistent = false;
    });
  },
  data() {
    return {
      host: null,
      input: "",
      isValid: false,
      isLoading: false,
      showDialog: false,
      persistent: true
    };
  },
  watch: {
    host(val) {
      this.$emit("input", val);
      this.input = val;
      if (!val) {
        this.showDialog = true;
        this.persistent = true;
      }
    }
  },
  methods: {
    getHost(mount = false) {
      this.host = localStorage.getItem("host");
      if (mount && !this.host) {
        this.showDialog = true;
        this.persistent = true;
      }
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
      window
        .require("electron")
        .remote.getCurrentWindow()
        .reload();
    }
  }
};
</script>

<style lang="css" scoped></style>
<i18n>
  {
    "en": {
      "Server Address": "Server Address"
    },
    "ar": {
      "Server Address": "عنوان الخادم"
    }
  }
</i18n>
