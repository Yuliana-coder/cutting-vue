import Vue from "vue";
import App from "./app.vue";
import router from "./router";
import store from "./store";
// import VueHtml2Canvas from 'vue-html2canvas';

// Vue.use(VueHtml2Canvas);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
