import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _024885ab = () => interopDefault(import('../pages/app.vue' /* webpackChunkName: "pages/app" */))
const _94874918 = () => interopDefault(import('../pages/user/index.vue' /* webpackChunkName: "pages/user/index" */))
const _59900028 = () => interopDefault(import('../pages/auth/login.vue' /* webpackChunkName: "pages/auth/login" */))
const _1ef1765c = () => interopDefault(import('../pages/msg/list.vue' /* webpackChunkName: "pages/msg/list" */))
const _6d5671e8 = () => interopDefault(import('../pages/msg/notice.vue' /* webpackChunkName: "pages/msg/notice" */))
const _47aadf5c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/app",
    component: _024885ab,
    name: "app"
  }, {
    path: "/user",
    component: _94874918,
    name: "user"
  }, {
    path: "/auth/login",
    component: _59900028,
    name: "auth-login"
  }, {
    path: "/msg/list",
    component: _1ef1765c,
    name: "msg-list"
  }, {
    path: "/msg/notice",
    component: _6d5671e8,
    name: "msg-notice"
  }, {
    path: "/",
    component: _47aadf5c,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
