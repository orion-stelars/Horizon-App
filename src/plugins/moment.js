import moment from "moment-with-locales-es6";
import "moment-timezone";
import Vue from "vue";

export default function() {
  Vue.prototype.$moment = moment;
}
