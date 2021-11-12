import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import vmodal from "vue-js-modal";
Vue.use(vmodal);

let password;
let passphrase = process.env.VUE_APP_PASSPHRASE;
while (password != passphrase) {
  password = prompt("Paste in the passphrase before proceeding.");
}

new Vue({
  render: (h) => h(App),
}).$mount("#app");
