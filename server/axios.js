import axios from 'axios'
// import config from './../nuxt.config'
// const config = require('./../nuxt.config')

export default {
  async post(url, data) {
    console.log('axios node_env:', process.env.nodeEnv)
    let domain = (process.env.nodeEnv == 'production') ? process.env.apiDomain : process.env.apiDomainLocal
    console.log('axios domain:', domain)
    url = domain + url
    console.log('axios url: ', url)
    let ret = await axios.post(url, data)
    console.log('axios status: ', ret.status)
    return ret.data
  }
}
