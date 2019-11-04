export default function (context) {

  // context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent

  if (process.server) {
    // console.log(context.req)
    let req = context.req
    let res = context.res
    let url = req.originalUrl
    let method = req.method || 'get'
    console.log('/auth method:', method)
    if (method.toLowerCase() === 'get') {
      if (url.indexOf('.js') > -1 || url.indexOf('.css') > -1 || url.indexOf('.ico') > -1 || url.indexOf('webpack') > -1) {

      } else {
        console.log('/auth url:', url)
        if (url.indexOf('/auth') < 0) {
          let token = req.session.TOKEN || ''
          console.log('/auth token: ', token)
          if (!token) {
            return res.redirect('/auth/login')
          }
        }
      }
    }


  } else {
    // console.log(context)
  }

}
