import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from "vite-plugin-windicss"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import {ElementPlusResolver} from "unplugin-vue-components/resolvers"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import * as path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon",
        })
      ],
      imports: ['vue']
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep', 'ic', 'fluent', 'mdi'],
        })
      ],
      dirs:["src/components", "src/views"],
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
        @use "./src/styles/zzinx58.scss"
        as *;
        `
      }
    }
  }
})
