import axios from './axios'

export default {

  async getUserListData(data) {
    let ret = await axios.post('/api/user/data/list', data)
    return ret
  },

  async getNoticeListData(data) {
    let ret = await axios.post('/api/user/notice/list', data)
    return ret
  },

  async noticeDataCreate(data) {
    let ret = await axios.post('/api/user/notice/create', data)
    return ret
  },

  async noticeDataUpdate(data) {
    let ret = await axios.post('/api/user/notice/update', data)
    return ret
  },

  async noticeSendUser(data) {
    let ret = await axios.post('/api/user/notice/sendUser', data)
    return ret
  },

  async noticeDelete(data) {
    let ret = await axios.post('/api/user/notice/delete', data)
    return ret
  },

  async getMessageListData(data) {
    let ret = await axios.post('/api/user/message/list', data)
    return ret
  }


}
