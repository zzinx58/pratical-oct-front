import { createApp } from "vue";
import "virtual:windi.css";
import App from "./App.vue";
import "element-plus/theme-chalk/dark/css-vars.css";
import router from "./router";
import pinia from "./store/pinia";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
