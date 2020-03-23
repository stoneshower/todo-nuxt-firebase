<template>
  <div class="container-task">
    <h1>{{ userName }} タスク💪</h1>
    <div v-if="getTodos.length">
      <ul v-for="(item, index) in getTodos" :key="item.title + index" class="wrapper">
        <li>
          <label>
            <input type="checkbox" :checked="item.isEditting" @change="updateEditState($event, getTodos, item)" />
          </label>
          <div v-if="item.isEditting" class="editItem">
            <div class="title-edit">
              <input :value="item.title" @change="editItem($event, getTodos, item)" />
            </div>
            <button v-if="!item.done" @click.prevent="updateItem(item)" class="update-button">更新</button>
            <button @click.prevent="deleteItem(item)" class="update-button">削除</button>
            <button v-if="!item.done" @click.prevent="doneItem(item)" class="update-button">完了</button>
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

    <form class="add-task">
      <div v-if="isAddMode">
        <input v-model="title" placeholder="例: PRのレビュー" class="add-task-input"/>
        <button :disabled="!hasValue" @click.prevent="addTodo(getTodos)" class="add-task-button">タスクを追加</button>
        <button @click.prevent="cancelAddTodo" class="cancel-task-button">キャンセル</button>
      </div>
      <button v-else class="btn-no-border" @click.prevent="makeEditMode">
        <span class="add-task-icon"><fa :icon="faPlusCircle" /></span> タスクを追加
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Loading from './Loading'
import { updateData, deleteData } from '@/mixins/changeFirebaseData'
import { db } from '@/plugins/firebase'

export default {
  name: 'AddPost',

  components: {
    Loading
  },

  props: {
    userName: {
      type: [String, null],
      required: true,
      default: 'xxx',
    }
  },

  data () {
    return {
      isAddMode: false,
      title: '',
      done: false,
      list: []
    }
  },

  created () {
    this.$store.dispatch('init')
  },

  computed: {
    ...mapGetters([
      'getTodos'
    ]),
    hasValue () {
      return this.title.length > 0
    },
    faPlusCircle () {
      return faPlusCircle
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
            isEditting: false,
            // timestamp: db.FieldValue.serverTimestamp()
          }
          toDoRef.add(newItem)
          // update local list state
          this.list = list
        }
      )

      this.isAddMode = true
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
    },
    makeEditMode () {
      this.isAddMode = true
    },
    cancelAddTodo () {
      this.isAddMode = false
    }
  }
}
</script>

<style scoped lang="scss">
.container-task {
  width: 100%;
  h1 {
    text-align: left;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 18px 0;
  justify-content: space-between;
  font-family: 'Quicksand', 'Source Sans Pro', sans-serif;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    label {
      padding-right: 8px;
    }
    input {
      display: block
    }
  }
}
.editItem {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  button {
    color: #555;
    cursor: pointer;
    font-size: 13px;
    padding: 2px 5px;
    text-decoration: none;
    white-space: nowrap;
    border: none;
  }
}
.done {
  text-decoration: line-through;
}
.title {
  font-size: 16px;
}
.btn-no-border {
  font-size: 14px;
  border: none;
  appearance: none;
  color: #808080;
  cursor: pointer;
  padding-left: 0;
  margin-bottom: 6px;

  &:hover {
    color: #dd4b39;
  }
}
.add-task {
  margin-top: 14px;
  text-align: left;
  margin-bottom: 6px;
}
.add-task-icon {
  color: #dd4b39;
}
.add-task-button {
  border-color: #b0281a;
  background-color: #db4c3f;
  font-weight: bold;
  font-size: 13px;
  line-height: 17px;
  text-decoration: none;
  padding: 6px 12px 7px 12px;
  position: relative;
  display: inline-block;
  border-radius: 3px;
  white-space: nowrap;
  text-decoration: none !important;
  text-align: center;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: .3;
  }

  &:hover {
    background-color: #c53727;
  }
}
.cancel-task-button {
  color: #555;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 5px;
  text-decoration: none;
  white-space: nowrap;
  border: none;
  font-weight: bold;
}
.add-task-input {
  box-shadow: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 13px;
  line-height: 17px;
  color: #202020;
  font-family: 'Quicksand', 'Source Sans Pro', sans-serif;
}
.title-edit {
  input {
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 6px 8px;
    font-size: 13px;
    line-height: 17px;
    color: #202020;
    font-family: 'Quicksand', 'Source Sans Pro', sans-serif;
  }
}
.update-button {
  border-color: #c7c7c7;
  background-color: #6d6d6d;
  font-weight: bold;
  font-size: 13px;
  line-height: 17px;
  text-decoration: none;
  padding: 6px 12px 7px 12px !important;
  position: relative;
  display: inline-block;
  border-radius: 3px;
  white-space: nowrap;
  text-decoration: none !important;
  text-align: center;
  color: #fff !important;
  cursor: pointer;
  margin: 0 6px;
}
</style>
