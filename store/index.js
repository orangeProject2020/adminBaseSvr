import axios from '@/assets/js/axios';

export const state = () => ({
  token: '',
  websiteName: "",
  appUrl: "",
  apps: [],
  subNavMsgIndex: '0'
})

export const mutations = {
  authTokenSet(state, data) {
    state.token = data
  },
  websiteNameSet(state, data) {
    console.log('/mutations websiteNameSet', data)
    state.websiteName = data
  },
  appUrlSet(state, data) {
    state.appUrl = data
  },
  websiteAppsSet(state, data) {
    state.apps = data
  },
  subNavMsgIndexSet(state, data) {
    state.subNavMsgIndex = data
  }
}

export const actions = {

  async onLogin(store, data = {}) {
    let ret = await axios.post('/api/user/auth/login', data)
    console.log('onLogin ret', ret)
    return ret
  },

  async onLogout(store) {
    let ret = await axios.post('/api/auth/logout')
    console.log('onLogout ret', ret)
    return ret
  }
}
