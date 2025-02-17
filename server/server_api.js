const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4000; // Port de l'API

// Fonction pour gérer les requêtes
const server = http.createServer((req, res) => {
  // Ajout des en-têtes CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet les requêtes de toutes les origines (change "*" en "http://localhost:3000" si tu veux restreindre l'accès)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Route pour récupérer les matchs
  if (req.url === "/" && req.method === "GET") {
    const jsonPath = path.join(__dirname, "data", "tristan-matchs.json");

    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Erreur lors de la lecture du fichier" })
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data); // Envoie le contenu JSON directement
    });
    return;
  }

  // Route non trouvée
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route non trouvée" }));
});

// Lancement du serveur
server.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
