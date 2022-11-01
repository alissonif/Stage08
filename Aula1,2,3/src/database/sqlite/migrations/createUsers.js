const createUsers = `
create table IF NOT EXISTS users (
  id integer PRIMARY KEY AUTOINCREMENT,
  name varchar,
  email varchar,
  password varchar,
  avatar varchar null,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
)
`
module.exports = createUsers;