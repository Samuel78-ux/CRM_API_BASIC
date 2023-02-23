module.exports = {
	security: {
		session: {
			jwt: {
				secret: process.env.JWT_SECRET,
			},
		},
	},
};
