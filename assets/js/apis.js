import axios from './axios'

export default {

  async getUserListData(data) {
    let ret = await axios.post('/api/user/data/list', data)
    return ret
  }
}
