import { createApp } from "vue";
import "virtual:windi.css";
// import './style.css'
import App from "./App.vue";
import "element-plus/theme-chalk/dark/css-vars.css";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
