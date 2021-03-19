import Vue from "vue";
import axios from "axios";

const authorization = localStorage.getItem("token");

export default function() {
  Vue.prototype.$axios = axios.create({
    baseURL: `${localStorage.getItem("host")}/api`,
    headers: {
      authorization
    }
  });
}
