exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 16).notNullable().unique().index();
    table.string("wallet", 42).notNullable().unique().index();
  });

exports.down = (knex) => knex.schema.dropTable("users");
