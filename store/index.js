import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/plugins/firebase'

Vue.use(Vuex)

export const strict = true

export const state = () => ({
  todo: [],
  user: null
})

export const mutations = {
  ...vuexfireMutations,
  SET_USER (state, payload) {
    state.user = payload
  }
}

export const actions = {
  init: firestoreAction((context) => {
    return context.bindFirestoreRef('todo', db.collection('todo'))
  }),
  setUser: ({ commit }, payload) => {
    commit('SET_USER', payload)
  }
}

export const getters = {
  getTodos: (state) => {
    const currentUserId = state.user.uid
    const targetTodo = state.todo.filter(item => item.userid === currentUserId)
    return targetTodo
  },
  isAuthenticated: (state) => {
    return !!state.user
  }
}
