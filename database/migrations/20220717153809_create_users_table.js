exports.up = async function (knex) {
  return await knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('lastSendMail').nullable();
    table.timestamp('emailVerifiedAt').nullable();
    table.string('refreshToken').nullable();
    table.boolean('isAdmin').defaultTo(false);
    table.string('passwordResetToken').nullable();
    table.boolean('resetPasswordStatus').defaultTo(false);
    table.jsonb('meta').defaultTo('{}');
    table.timestamp('lastLoginAt').nullable();
    table.timestamp('passwordResetTimestamp').nullable();
    table.enum('status', ['active', 'inactive']).defaultTo('inactive');
    table.enum('roleType', ['admin', 'user']).defaultTo('user');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down =  async function (knex) {
  return await knex.schema.dropTable('users');
};
