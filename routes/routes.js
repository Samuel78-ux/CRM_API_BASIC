const express = require("express");
const bcrypt = require("bcrypt");
const knex = require("knex")(require("../knexfile"));
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

async function getUserByEmail(email) {
	const user = await knex("users").where({ email }).first();
	return user;
}

async function comparePassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

function generateToken(user) {
	const payload = {
		id: user.id,
		email: user.email,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1 day",
	});
}

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

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(401).send("Invalid email or password");
		}
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(401).send("Invalid email or password");
		}
		const token = generateToken(user);
		res.send({ token });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});
router.get("/users/login", (req, res) => {
	ejs.renderFile(__dirname + "/../views/users/login.ejs", (err, html) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal server error");
		} else {
			res.send(html);
		}
	});
});

module.exports = router;
