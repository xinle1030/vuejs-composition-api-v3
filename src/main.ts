import { createApp } from 'vue'
import { createPinia } from "pinia"
import { router } from "./router"
import App from './App.vue'
import { useUsers } from './stores/users';
import { usePosts } from './stores/posts';

const app = createApp(App) // create a new application passing in our root component
app.use(createPinia())

const usersStore = useUsers();
const postsStore = usePosts();

Promise.all([
  usersStore.authenticate(),
  postsStore.fetchPosts()
]).then(() => {
  app.use(router)
  app.mount('#app') // mount it to the div with id = app in index.html
})

