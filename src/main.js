import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import vmodal from "vue-js-modal";
Vue.use(vmodal);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
