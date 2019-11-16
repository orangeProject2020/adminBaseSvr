export default [{
  id: "21",
  name: "website",
  title: "网站管理",
  url: (process.env.nodeEnv == 'production') ?
    "http://adminWebsite.demo.jianpiane.com" : "http://127.0.0.1:10012"
  // url: "http://adminWebsite.demo.jianpiane.com"
}, {
  id: "22",
  name: "mall",
  title: "商城管理",
  url: (process.env.nodeEnv == 'production') ?
    "http://adminMall.demo.jianpiane.com" : "http://127.0.0.1:10014"
  // url: "http://adminMall.demo.jianpiane.com"
}, {
  id: "23",
  name: "miniApp",
  title: "微信小程序",
  url: "https://mp.weixin.qq.com/cgi-bin/wx?token=&lang=zh_CN"
}, {
  id: "24",
  name: "meiqia",
  title: "美洽客服",
  url: "https://www.meiqia.com/"
}]
