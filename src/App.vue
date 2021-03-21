<template>
  <v-app>
    <v-app-bar app color="primary darken-3" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/img/logo/logo.png"
          transition="scale-transition"
          width="65"
        />
        <span class="font-weight-bold cairo-font">إدارة التجنيد و التعبئة</span>
      </div>

      <v-spacer></v-spacer>

      <auth />
    </v-app-bar>

    <v-main>
      <host v-model="host" />
      <welcome-dialog />
      <router-view v-if="host" />
      <v-container v-if="host && $socket.connected && auth">
        <v-row justify="end">
          <v-col cols="12" lg="3" md="4">
            <v-card>
              <v-card-title>{{ $t("Connected Users") }}</v-card-title>
              <v-card-text>
                <p
                  v-for="(user, u) in connectedUsers"
                  :key="u"
                  v-text="user.name"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="primary darken-3" dark>
      <div>
        <v-col cols="auto">
          <v-row justify="center" align="center">
            <v-col cols="auto">
              <v-icon>mdi-white-balance-sunny</v-icon>
            </v-col>
            <v-col cols="auto" class="px-0">
              <v-switch v-model="$vuetify.theme.isDark" color="blue" />
            </v-col>
            <v-col cols="auto">
              <v-icon>mdi-moon-waning-crescent</v-icon>
            </v-col>
          </v-row>
        </v-col>
      </div>
      <v-spacer />
      <div class="locale-changer">
        <v-select
          v-model="locale"
          :items="langs"
          item-text="label"
          item-value="key"
          append-icon="mdi-translate"
          outlined
          dense
        />
      </div>
      <div style="width: 100%; display: block">
        <v-divider />
      </div>
      <v-row justify="center" align="center">
        <v-col cols="12" lg="6">
          <v-row justify="center" class="pt-5">
            <v-col cols="auto" class="mb-0 pb-0">
              <v-avatar size="150">
                <v-img src="/horizon.png" />
              </v-avatar>
            </v-col>
          </v-row>
          <v-row justify="center" class="pt-0">
            <v-col cols="auto" class="mb-0 pb-0">
              <p
                style="font-weight: 200; font-size: 40px; font-family: monospace; direction: ltr; color: #FC9C8F"
                class="px-3 text-center pa-0 ma-0"
              >
                Horizon&copy;
              </p>
            </v-col>
          </v-row>
          <v-row justify="center" class="pt-0">
            <v-col cols="auto" class="mb-0 pb-0">
              <v-chip
                color="#30E9B6"
                style="color: #162238; font-weight: bold; direction: ltr"
              >
                <v-icon>
                  mdi-label
                </v-icon>
                V{{ pack.version }}
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" lg="6" class="mt-2">
          <v-row>
            <v-col cols="12">
              <v-avatar size="55">
                <v-img src="/orion-logo.png" />
              </v-avatar>
              <span style="font-weight: bold; font-size: 20px" class="px-3">{{
                $t("Orion Software Solutions")
              }}</span>
            </v-col>
            <v-col cols="12">
              <v-list color="primary darken-3">
                <v-list-item>
                  <v-btn text href="https://orionstelars.com" target="_blank">
                    <v-icon class="px-2">mdi-web</v-icon>
                    {{ $t("Visit Us") }}
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    text
                    href="https://orionstelars.com/projects"
                    target="_blank"
                  >
                    <v-icon class="px-2">mdi-atom</v-icon>
                    {{ $t("Our Projects") }}
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    text
                    href="https://orionstelars.com/about"
                    target="_blank"
                  >
                    <v-icon class="px-2">mdi-information-outline</v-icon>
                    {{ $t("About Us") }}
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    text
                    href="https://orionstelars.com/amr-moussa"
                    target="_blank"
                  >
                    <v-icon class="px-2">mdi-phone</v-icon>
                    {{ $t("Contact Us") }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="pt-5">
          <p class="grey--text text--lighten-1 text-center">
            <span class="px-1">{{ $t("All Rights Reserved") }}</span>
            <b class="px-1">{{ $t("ORION") }}&copy;</b>
            <span class="px-1">{{ new Date().getFullYear() }}</span>
          </p>
        </v-col>
      </v-row>
    </v-footer>
    <notifications />
  </v-app>
</template>

<script>
import Auth from "@/components/Auth";
import Host from "@/components/Host";
import WelcomeDialog from "@/components/WelcomeDialog";
import pack from "@/../package";
import Notifications from "@/components/common/notifications";
const defaultLang = process.env.VUE_APP_I18N_LOCALE;
export default {
  name: "App",

  components: {
    Auth,
    Notifications,
    WelcomeDialog,
    Host
  },

  data() {
    return {
      pack,
      langs: [
        { key: "en", label: "English", rtl: false, moment: "en" },
        { key: "ar", label: "العربية", rtl: true, moment: "ar-sa" }
      ],
      activeUsers: {},
      locale: defaultLang,
      host: null
    };
  },
  mounted() {
    //
    // this.$vuetify.theme.themes.dark.primary = "#CFD8DC";
    this.$socket.client.on("user_added", val => {
      this.activeUsers = val.activeUsers;
    });
    this.$socket.client.on("user_disconnected", val => {
      this.activeUsers = val.activeUsers;
    });
  },
  watch: {
    "$i18n.locale": {
      immediate: true,
      handler(val) {
        const index = this.langs.findIndex(i => i.key === val);
        if (index !== -1) {
          this.$vuetify.rtl = this.langs[index].rtl;
          this.$moment.locale(this.langs[index].moment);
        }
      }
    },
    auth: {
      // immediate: true,
      handler(val) {
        if (this.$socket && this.$socket.connected) {
          if (!val) {
            this.$socket.client.disconnect();
          }
        }
      }
    },
    socketConnected: {
      immediate: true,
      handler(val) {
        if (val && this.auth) {
          this.$socket.client.emit("add_user", this.auth);
        }
      }
    },
    locale: {
      immediate: true,
      handler(val) {
        if (val) this.$root.$i18n.locale = val;
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth.user;
    },
    socketConnected() {
      return this.$socket.connected;
    },
    connectedUsers() {
      return Object.values(this.activeUsers);
    }
  }
};
</script>
<i18n>
  {
    "en": {
      "Connected Users": "Connected Users",
      "ORION": "ORION",
      "Orion Software Solutions": "Orion Software Solutions",
      "All Rights Reserved": "All Rights Reserved"

    },
    "ar": {
      "Connected Users": "المستخدمين المتصلين",
      "ORION": "اورايون",
      "Orion Software Solutions": "اورايون للبرمجيات",
      "All Rights Reserved": "جميع الحقوق محفوظة"
    }
  }
</i18n>
<style lang="scss">
// font
@font-face {
  font-family: "Cairo";
  src: url("/fonts/Cairo/Cairo-Regular.ttf");
  font-weight: 250;
  font-style: normal;
}
@font-face {
  font-family: "Cairo";
  src: url("/fonts/Cairo/Cairo-Bold.ttf");
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: "Cairo";
  src: url("/fonts/Cairo/Cairo-BoldItalic.ttf");
  font-weight: bold;
  font-style: italic;
}
@font-face {
  font-family: "Cairo";
  src: url("/fonts/Cairo/Cairo-LightItalic.ttf");
  font-weight: light;
  font-style: italic;
}
@font-face {
  font-family: "Cairo";
  src: url("/fonts/Cairo/Cairo-Light.ttf");
  font-weight: light;
  font-style: normal;
}
html,
body,
p,
h1,
h2,
h3,
h4,
h5,
h6,
span,
li,
button,
div {
  font-family: "Cairo", sans-serif;
}
html {
  font-family: "Cairo", sans-serif;
  font-size: 18px;
  word-spacing: 1px;
  font-size: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
h1,
h2,
h3,
h4,
h5,
h6,
.cairo-font,
.title,
.text-heading-1,
.text-heading-2,
.text-heading-3,
.text-heading-4,
.text-heading-5,
.text-h1,
.text-h2,
.text-h3,
.text-h4,
.text-h5,
.text-h6,
.text-heading-6,
.text-subtitle-1,
.text-subtitle-2,
.text-subtitle-3 {
  font-family: "Cairo", sans-serif !important;
}
.v-btn {
  letter-spacing: 0 !important;
}
</style>
