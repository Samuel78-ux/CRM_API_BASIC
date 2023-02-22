const express = require("express");
const app = express();
const routes = require("./routes/routes");

// Configuration de l'application Express
app.use(express.urlencoded({ extended: true }));

// Routes de l'application
app.use("/", routes);

// Démarrage du serveur
app.listen(3000, () => {
	console.log("Serveur démarré sur le port 3000");
});
