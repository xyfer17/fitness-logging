exports.up = function (knex) {
  return knex.schema.createTable('exercise_logs', function (table) {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.string('exerciseName').notNullable();
    table.string('description');
    table.integer('duration').notNullable();
    table.time('time').notNullable();
    table
      .enum('day', [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ])
      .notNullable();
    table.date('date').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('exercise_logs');
};
