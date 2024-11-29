import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loginInfo: {
      email: '',
      password: '',
      rememberMe: false
    },
    userInfo: null
  }),
  actions: {
    setLoginInfo(loginInfo) {
      this.loginInfo = loginInfo
      if (loginInfo.rememberMe) {
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
      } else {
        localStorage.removeItem('loginInfo')
      }
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      console.log('userInfo', userInfo)
    },
    clearLoginInfo() {
      this.loginInfo = {
        email: '',
        password: '',
        rememberMe: false
      }
      localStorage.removeItem('loginInfo')
    },
    clearUserInfo() {
      this.userInfo = null
      localStorage.removeItem('userInfo')
    }
  },
  persist: {
    enabled: true, // 启用持久化
    storage: localStorage, // 使用 localStorage 作为存储方式
    paths: ['loginInfo', 'userInfo'] // 指定需要持久化的状态
  }
})
