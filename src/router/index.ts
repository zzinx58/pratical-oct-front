import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Index",
        component: () => import("@/App.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;