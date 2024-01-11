// new user that does not exist in the db, so dh id
export interface NewUser {
  username: string
  password: string
}

// a user in a db, requires id
export interface User extends NewUser {
  id: string
}