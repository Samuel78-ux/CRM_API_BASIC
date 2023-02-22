// Update with your config settings.

/**
 * @type { import("knex").Knex.Config }
 */
module.exports = {
	client: "pg",
	connection: {
		host: "localhost",
		user: "postgres",
		password: "root",
		database: "CRM_API",
	},
};
