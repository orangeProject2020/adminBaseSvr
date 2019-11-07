module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [
    'tailwindcss/dist/tailwind.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios'
  ],

  // axios: {
  //   proxy: true // Can be also an object with default options
  // },

  // proxy: {
  //   '/api/': 'http://localhost:10011/api/',
  // },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  server: {
    port: 10011
  },

  api: {
    host: 'http://127.0.0.1',
    port: '10000',
    channel_id: '887',
    key: 'sdgjshhgdsagjdjkhkklgskjesegauhopqpogb'
  },

  router: {
    // middleware: 'auth'
  },

  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    apiDomain: 'http://admin.demo.jianpiane.com',
    apiDomainLocal: 'http://127.0.0.1:10011',
    apiHttpHost: 'http://api.demo.jianpiane.com',
    apiHttpHostLocal: 'http://127.0.0.1:10000'
  }
}
