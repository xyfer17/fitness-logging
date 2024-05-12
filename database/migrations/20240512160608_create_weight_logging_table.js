exports.up = function (knex) {
  return knex.schema.createTable('weight_logs', function (table) {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.decimal('weight').notNullable();
    table.decimal('height').notNullable();
    table.decimal('bicepSize');
    table.decimal('thighSize');
    table.decimal('bellySize');
    table.date('date').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('weight_logs');
};
