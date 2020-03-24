<template>
  <div class="container">
    <div class="container-login" :class="isAuthenticated ? 'isAuthenticated' : ''">
      <!-- ログイン中に表示される画面 -->
      <div v-if="isAuthenticated">
        <AddPost :userName="displayName" :userid="uid" />
        <button @click="logout" class="formBtn">ログアウト</button><br>
      </div>
      <!-- ログインしていない時に表示される画面 -->
      <div v-else>
        <div v-if="entryMode === 'create'" class="inputWrapper">
          <label>
            <p>Name</p>
            <input type="text" v-model="displayName">
          </label>
        </div>

        <div class="inputWrapper">
          <label>
            <p>Email</p>
            <input type="text" v-model="email">
          </label>
        </div>

        <div class="inputWrapper">
          <label>
            <p>パスワード</p>
            <input type="password" v-model="password"><br>
          </label>
        </div>

        <div class="btnWrapper">
          <button v-if="entryMode === 'login'" @click="login" class="formBtn">ログイン</button>
          <button v-if="entryMode === 'create'" @click="signup" class="formBtn">登録</button>
        </div>

        <p class="errorMsg"><label><input type="checkbox" @change="switchAddUser($event)"> アカウントを作成する</label></p>
        <p class="errorMsg">{{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import AddPost from '@/components/AddPost'
import firebase from '@/plugins/firebase'
export default {
  components: {
    AddPost
  },
  data () {
    return {
      entryMode: 'login',
      email: '',
      password: '',
      displayName: '',
      uid: '',
      error: {
        code: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated'])
  },
  mounted () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { email, uid } = user
        const targetUser = firebase.auth().currentUser
        this.uid = targetUser.uid
        this.setUser({ email, uid })
      } else {
        console.log('error', user)
      }
    })
  },
  methods: {
    ...mapActions(['setUser']),
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          const targetUser = firebase.auth().currentUser
          this.uid = targetUser.uid
        })
        .catch((err) => {
          this.error.code = err.code
          this.error.message = err.message
          console.log('this.error', this.error)
        })
    },
    logout () {
      firebase.auth().signOut()
        .then(() => {
          this.setUser(null)
          this.uid = ''
          this.entryMode = 'login'
          this.error.message = ''
          this.displayName = ''
          this.email = ''
          this.password = ''
        })
        .catch((err) => {
          this.error.code = err.code
          this.error.message = err.message
          console.log('this.error', this.error)
        })
    },
    signup () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          const targetUser = firebase.auth().currentUser
          this.uid = targetUser.uid
          targetUser.updateProfile({
            displayName: this.displayName
          })
            .then(() => {
              console.log('Registered!')
            })
            .catch(err => console.log('cannot add user name', err))
        })
        .catch((err) => {
          this.error.code = err.code
          this.error.message = err.message
          console.log('this.error', this.error)
        })
    },
    switchAddUser (e) {
      this.entryMode = e.target.checked ? 'create' : 'login'
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  padding: 18px;
  display: flex;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.container-login {
  width: 100%;
  max-width: 280px;
  border: 1px solid #ccc;
  padding: 12px 24px 30px;
  margin: auto;
}

.inputWrapper {
  margin-top: 12px;
  label p {
    margin-bottom: 8px;
  }
  input {
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 6px 8px;
    font-size: 13px;
    line-height: 17px;
    color: #202020;
    width: 100%;
    font-family: 'Quicksand', 'Source Sans Pro', sans-serif;
  }
}

.formBtn {
  border: none;
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
  width: 100px;
}

.btnWrapper {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.errorMsg {
  color: #202020;
  font-size: 14px;
  margin-top: 12px;
}

.isAuthenticated {
  max-width: 400px;
}
</style>
