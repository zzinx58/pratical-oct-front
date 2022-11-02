import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/gallery"
    },
    {
        // path: "/index",
        path: "/draw",
        name: "DrawPainting",
        component: () => import("@/views/DrawPainting.vue")
    },
    {
        path: "/test",
        name: "Test",
        component: () => import("@/Test.vue")
    },
    {
        path: "/gallery",
        name: "Gallery",
        component: () => import("@/views/Gallery.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;