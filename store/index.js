import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/plugins/firebase'

Vue.use(Vuex)
const INIT_TODO = 'INIT_TODO'

const store = () => (
  new Vuex.Store({
    strict: true,
    state: {
      todo: []
    },
    mutations: vuexfireMutations,
    actions: {
      [INIT_TODO]: firestoreAction((context) => {
        return context.bindFirestoreRef('todo', db.collection('todo'))
      })
    },
    getters: {
      getTodos: (state) => {
        return state.todo
      }
    }
  })
)

export default store
