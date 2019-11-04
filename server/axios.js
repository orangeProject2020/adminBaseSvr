import axios from 'axios'
// import config from './../nuxt.config'
// const config = require('./../nuxt.config')

export default {
  async post(url, data) {
    url = 'http://127.0.0.1:10011' + url
    console.log('axios url: ', url)
    let ret = await axios.post(url, data)
    console.log('axios status: ', ret.status)
    return ret.data
  }
}
