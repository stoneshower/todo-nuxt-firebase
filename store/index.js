import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/plugins/firebase'

Vue.use(Vuex)

const store = () => (
  new Vuex.Store({
    strict: true,
    state: {
      todo: [],
      user: null
    },
    mutations: {
      ...vuexfireMutations,
      SET_USER (state, payload) {
        state.user = payload
      }
    },
    actions: {
      init: firestoreAction((context) => {
        return context.bindFirestoreRef('todo', db.collection('todo'))
      }),
      setUser: ({ commit }, payload) => {
        commit('SET_USER', payload)
      }
    },
    getters: {
      getTodos: (state) => {
        return state.todo
      },
      isAuthenticated: (state) => {
        return !!state.user
      }
    }
  })
)

export default store
