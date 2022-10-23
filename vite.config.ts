import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from "vite-plugin-windicss"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import {ElementPlusResolver} from "unplugin-vue-components/resolvers"
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs:["scr/components", "src/views"],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve("./src"),
      },
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use as *;
        `
      }
    }
  }
})
