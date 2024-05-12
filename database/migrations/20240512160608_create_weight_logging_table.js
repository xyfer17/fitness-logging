exports.up = async function (knex) {
  return await knex.schema.createTable('weight_logs', function (table) {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.float('weight').notNullable();
    table.float('height').notNullable();
    table.float('bicepSize');
    table.float('thighSize');
    table.float('bellySize');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return await knex.schema.dropTable('weight_logs');
};
