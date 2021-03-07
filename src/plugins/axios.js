import Vue from "vue";
import axios from "axios";

const baseURL = process.env.VUE_APP_BASE_URL;
const authorization = localStorage.getItem("token");

export default function() {
  Vue.prototype.$axios = axios.create({
    baseURL,
    headers: {
      authorization
    }
  });
}
