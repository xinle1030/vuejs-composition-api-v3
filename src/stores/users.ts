import { defineStore } from "pinia";
import { NewUser } from "../users";

interface UsersState {
  currentUserId?: string
}

export const useUsers = defineStore("users", {
  state: (): UsersState => ({
    currentUserId: undefined,
  }),

  actions: {

    // authenticate if the current user has signed in 
    async authenticate() {
      try {
        const res = await window.fetch("/api/current-user", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        this.currentUserId = result.id;
      } catch (e) {
        this.currentUserId = undefined;
      }
    },

    async logout() {
      await window.fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // update cookie to ""
      return this.authenticate();
    },

    async createUser(newUser: NewUser) {
      const body = JSON.stringify(newUser);
      await window.fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      // update cookie to new user id
      return this.authenticate();
    },
  },
});