import { DateTime } from "luxon" // datetime library
import { defineStore } from "pinia"
import { Period } from "../constants"
import { Post, today, thisWeek, thisMonth, TimelinePost } from "../posts"

interface PostsState {
  ids: string[] // array of string type
  all: Map<string, Post> // {id : Post}
  selectedPeriod: Period
}

function delay () {
  return new Promise<void>(res => setTimeout(res, 1500))
}


// define store
export const usePosts = defineStore("posts", {
  state: (): PostsState => ({
    ids: [],
    all: new Map(),
    selectedPeriod: "Today"
  }),

  actions: {
    setSelectedPeriod (period: Period) {
      this.selectedPeriod = period
    },

    async fetchPosts () {
      const res = await window.fetch("/api/posts")
      const data = (await res.json()) as Post[] // cast to array of Post
      await delay()

      let ids: string[] = []
      let all = new Map<string, Post>()
      for (const post of data) {
        ids.push(post.id)
        all.set(post.id, post)
      } 

      this.ids = ids
      this.all = all
    },

    createPost (post: Post) {
      const body = JSON.stringify(post)
      return window.fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body
      })
    },

    updatePost (post: Post) {
      const body = JSON.stringify(post)
      return window.fetch("/api/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body
      })
    }
  },

  // to get the state: filteredPosts
  getters: {
    filteredPosts: (state): TimelinePost[] => {
      return state.ids
      .map(id => {
        const post = state.all.get(id) // to get post based on corresponding id

        // null check
        if (!post) {
          throw Error(`Post with id of ${id} was expected but not found.`)
        }

        return {
          ...post,
          created: DateTime.fromISO(post.created)
        }
      })
      .filter(post => {
        if (state.selectedPeriod === "Today") {
          // return today's post
          return post.created >= DateTime.now().minus({ day: 1 })
        }

        if (state.selectedPeriod  === "This Week") {
          // return this week's post
          return post.created >= DateTime.now().minus({ week: 1 })
        }

        return post
      })
    }
  }
})
