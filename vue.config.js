module.exports = {
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    electronBuilder: {
      builderOptions: {
        win: {
          icon: "./assets/icons/win/icon.ico"
        },
        mac: {
          icon: "./assets/icons/mac/icon.ico"
        }
      }
    }
  }
};
