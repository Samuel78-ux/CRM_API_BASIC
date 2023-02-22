const express = require("express");
const bcrypt = require("bcrypt");
const knex = require("knex")(require("../knexfile"));
const ejs = require("ejs");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// Route pour afficher le formulaire de création d'utilisatrseur
router.get("/users/new", (req, res) => {
	ejs.renderFile(__dirname + "/../views/users/new.ejs", (err, html) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal server error");
		} else {
			res.send(html);
		}
	});
});

// Route pour créer un nouvel utilisateur dans la base de données
router.post("/users", async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const users = {
			username,
			password: hashedPassword,
			email: email,
		};
		await knex("users").insert(users);
		res.redirect("/users/new");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
