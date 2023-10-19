// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path"
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  alias: {
    "@": resolve(__dirname, "./")
  },
  css: [
    "~/assets/css/main.scss",
    "@fortawesome/fontawesome-svg-core/styles.css"
  ],
  modules: [
    "@nuxtjs/tailwindcss",
    '@nuxtjs/supabase'
  ]
})
