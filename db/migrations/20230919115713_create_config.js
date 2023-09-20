exports.up = (knex) =>
  knex.schema.createTable("config", (table) => {
    table.string("key").primary();
    table.json("value");
  });

exports.down = (knex) => knex.schema.dropTable("config");
