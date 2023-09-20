require("dotenv").config();

module.exports = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: __dirname + "/db/migrations",
    tableName: "knex_migrations",
  },
};
