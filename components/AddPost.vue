<template>
  <div>
    <p>Todo</p>
    <div v-if="getTodos.length">
      <ul v-for="(item, index) in getTodos" :key="item.title + index" class="wrapper">
        <li>
          <label v-if="!item.done">
            <input type="checkbox" :checked="item.isEditting" @change="updateEditState($event, getTodos, item)" />
          </label>
          <div v-if="item.isEditting" class="editItem">
            <div class="title-edit">
              <input :value="item.title" @change="editItem($event, getTodos, item)" />
            </div>
            <button @click.prevent="updateItem(item)">更新</button>
            <button @click.prevent="deleteItem(item)">削除</button>
            <button @click.prevent="doneItem(item)">完了</button>
          </div>
          <div v-else>
            <div class="title" :class="item.done ? 'done' : ''">{{ item.title }}</div>
          </div>

          <!-- <div class="id">{{ item.id }}</div> -->
        </li>
      </ul>
    </div>
    <div v-else>
      <Loading />
    </div>

    <form>
      <input v-model="title" />
      <button :disabled="!hasValue" @click.prevent="addTodo(getTodos)">Add Todo</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loading from './Loading'
import { updateData, deleteData } from '@/mixins/changeFirebaseData'
import { db } from '@/plugins/firebase'

export default {
  name: 'AddPost',

  components: {
    Loading
  },

  data () {
    return {
      title: '',
      done: false,
      list: []
    }
  },

  created () {
    this.$store.dispatch('INIT_TODO')
  },

  computed: {
    ...mapGetters([
      'getTodos'
    ]),
    hasValue () {
      return this.title.length > 0
    }
  },

  methods: {
    addTodo (list) {
      const toDoRef = db.collection('todo')
      const checkDuplicatedValue = toDoRef.get().then((querySnapShot) => {
        return querySnapShot.docs.some(doc => doc.data().title === this.title)
      })

      checkDuplicatedValue.then(
        (hasDuplicatedValue) => {
          if (hasDuplicatedValue) {
            return
          }
          const newItem = {
            title: this.title,
            done: false,
            isEditting: false
          }
          toDoRef.add(newItem)
          // update local list state
          this.list = list
        }
      )
    },
    updateEditState (event, list, item) {
      this.list = list
      const newObj = {
        isEditting: event.target.checked
      }
      updateData(newObj, list, item)
    },
    updateItem (item) {
      const currentItem = this.list.filter(elem => elem.id === item.id)[0]
      const newObj = {
        title: currentItem.title,
        isEditting: false
      }
      updateData(newObj, this.list, currentItem)
    },
    deleteItem (item) {
      deleteData(this.list, item)
    },
    doneItem (item) {
      const currentItem = this.list.filter((elem) => {
        return elem.id === item.id
      })[0]
      const newObj = {
        done: true,
        isEditting: false
      }
      updateData(newObj, this.list, currentItem)
    },
    editItem (event, list, item) {
      const currentValue = event.target.value
      const newList = (array, id, value) => {
        return array.map(item => (
          id === item.id
            ? {
              id: item.id,
              title: value
            }
            : {
              id: item.id,
              title: item.title
            }
        ))
      }

      this.list = newList(list, item.id, currentValue)
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: flex-start;
  padding: 0;
  justify-content: space-between;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  li {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}
.editItem {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.done {
  text-decoration: line-through;
}
.title {
  font-size: 16px;
}
</style>
