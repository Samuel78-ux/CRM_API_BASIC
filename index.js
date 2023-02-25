import express from "express";
import routes from "./routes/routes.js";
import morgan from "morgan";

const app = express();

// Ajouter le middleware morgan
app.use(morgan("dev"));

// Configuration de l'application Express
app.use(express.urlencoded({ extended: true }));

// Routes de l'application
app.use("/", routes);

// Démarrage du serveur
app.listen(3000, () => {
	console.log("Serveur démarré sur le port 3000");
});
