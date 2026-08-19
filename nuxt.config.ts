// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      exclude: ['../vitest.config.ts'],
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  eslint: {
    config: {
      stylistic: false,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData(source: string, filename: string): string {
            const normalizedPath = filename.replaceAll('\\', '/')

            if (normalizedPath.includes('/assets/styles/')) {
              return source
            }

            return `@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;
${source}`
          },
        },
      },
    },
  },
})
