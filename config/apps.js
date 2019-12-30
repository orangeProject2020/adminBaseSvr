export default [
  //   {
  //   id: "21",
  //   name: "website",
  //   title: "网站管理",
  //   url: (process.env.nodeEnv == 'production') ?
  //     "http://website.admin.sunonenight.com" : "http://127.0.0.1:10012"
  // }, 
  {
    id: "22",
    name: "mall",
    title: "商城管理",
    url: (process.env.nodeEnv == 'production') ?
      "http://mall.admin.sunonenight.com" : "http://127.0.0.1:10014"
  }, {
    id: "23",
    name: "weixin",
    title: "微信开发平台",
    // url: "https://mp.weixin.qq.com/cgi-bin/wx?token=&lang=zh_CN",
    url: 'https://open.weixin.qq.com/'
  }, {
    id: "24",
    name: "alipay",
    title: "支付宝",
    url: "https://b.alipay.com/"
  }
]
