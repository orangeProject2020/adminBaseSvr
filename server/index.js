const express = require('express')
const cors = require('cors')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()
const bodyParser = require("body-parser"); // 处理请求中body的内容
const methodOverride = require("method-override");
const session = require("express-session"); // session中间件

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // app.set('trust proxy', 1)
  app.use(
    session({
      name: 'adminBaseClient',
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 6
      },
      secret: "962055fd-2ae5-4880-9d40-eecd5bd3fe03" // session加密
    })
  );

  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.use(
    bodyParser.raw({
      type: "application/xml"
    })
  );
  app.use(
    bodyParser.text({
      type: "text/xml"
    })
  );

  // allow overriding methods in query (?_method=put)
  app.use(methodOverride("_method"));

  app.use(cors())

  app.use("/api", require("./api"));

  app.use(async (req, res, next) => {
    let url = req.originalUrl
    let method = req.method || 'get'
    console.log('/auth method:', method)
    let token = req.session.token || ''
    console.log('/auth token: ', token)
    if (method.toLowerCase() === 'get') {
      if (url.indexOf('.js') > -1 || url.indexOf('.css') > -1 || url.indexOf('.ico') > -1 || url.indexOf('webpack') > -1 || url.indexOf('/.map') > -1 || url.indexOf('_nuxt') > -1) {
        next()
      } else {
        console.log('/auth url:', url)
        if (url.indexOf('/auth') < 0) {
          if (!token) {
            return res.redirect('/auth/login')
          }
        }

        next()
      }
    }

    // next()
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
