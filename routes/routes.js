import express from "express";
import bcrypt from "bcrypt";
import knex from "knex";
import knexConfig from "../knexfile.js";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

const db = knex(knexConfig);

async function getUserByEmail(email) {
	const user = await db("users").where({ email }).first();
	return user;
}

async function comparePassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

function generateToken(user, res) {
	const payload = {
		id: user.id,
		email: user.email,
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1 day",
	});

	res.cookie("token", token, { httpOnly: true });

	return token;
}

router.get("/", (req, res) => {
	res.send("Welcome to the CRM API");
});

router.get("/users/new", (req, res) => {
	ejs.renderFile("./views/users/new.ejs", (err, html) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal server error");
		} else {
			res.send(html);
		}
	});
});

router.post("/users", async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const users = {
			username,
			password: hashedPassword,
			email,
		};
		await db("users").insert(users);
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

		const token = generateToken(user, res);
		res.send("Logged in successfully");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

router.get("/users/login", (req, res) => {
	ejs.renderFile("./views/users/login.ejs", (err, html) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal server error");
		} else {
			res.send(html);
		}
	});
});

router.get("/protected", authMiddleware, (req, res) => {
	res.send("You are authorized to access this resource.");
});

export default router;
