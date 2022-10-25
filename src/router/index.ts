import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/index",
        name: "Index",
        component: () => import("@/views/DrawPainting.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;