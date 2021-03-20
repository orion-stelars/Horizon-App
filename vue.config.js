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
          icon: "./icon.ico"
        },
        mac: {
          icon: "./icon.icns"
        }
      }
    }
  }
};
