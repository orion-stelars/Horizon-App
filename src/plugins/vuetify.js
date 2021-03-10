import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  // customVariables: ["~/assets/sass/vuetify-variables.scss"],
  treeShake: true,
  options: {
    customProperties: true
  },
  defaultAssets: {
    font: {
      family: "Cairo"
    }
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.blueGrey.base
      }
    }
  }
});
