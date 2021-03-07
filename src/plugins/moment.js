import moment from "moment";
import "moment-timezone";
import Vue from "vue";

export default function() {
  Vue.prototype.$moment = moment;
}
