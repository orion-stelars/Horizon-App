import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
// import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  // customVariables: ["~/assets/sass/vuetify-variables.scss"],
  // icons: {
  //   iconfont: "mdi"
  // },
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
