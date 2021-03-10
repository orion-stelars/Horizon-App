import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "./plugins/axios";
import moment from "./plugins/moment";
import lodash from "./plugins/lodash";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";
import i18n from "./i18n";

const serverUrl = "http://localhost:6070";
const socket = io(serverUrl, {
  reconnection: true,
  reconnectionDelay: 500,
  maxReconnectionAttempts: Infinity
});

console.log("server ir", serverUrl);

Vue.use(VueSocketIOExt, socket, { store });

axios();
moment();
lodash();

Vue.config.productionTip = false;

window.App = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
