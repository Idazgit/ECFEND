const http = require("http");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
};

const server = http.createServer((req, res) => {
  // Log pour debug
  console.log(`Requête reçue : ${req.url}`);

  // Ajout des headers CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Autoriser une origine spécifique
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Autoriser ces méthodes
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Autoriser ces en-têtes
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Si tu utilises des cookies ou des informations d'authentification

  // Si la requête est de type OPTIONS, répondre directement sans continuer à traiter
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No content
    return res.end();
  }

  // Gestion de la route racine '/'
  if (req.url === "/") {
    const indexPath = path.join(__dirname, "..", "public", "index.html");
    console.log(`Tentative de chargement du fichier index.html : ${indexPath}`); // Debug ici
    fs.readFile(indexPath, (error, content) => {
      if (error) {
        console.error(
          `Erreur lors du chargement de index.html : ${error.message}` // Log d'erreur détaillé
        );
        res.writeHead(500);
        res.end("Erreur lors du chargement de index.html");
        return;
      }
      console.log("Fichier index.html chargé avec succès");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
    return;
  }

  // Route pour les fichiers statiques
  let filePath = path.join(__dirname, "..", "public", req.url);
  const extname = path.extname(filePath);

  // Log pour debug
  console.log(`Tentative d'accès au fichier : ${filePath}`);
  console.log(`Extension détectée : ${extname}`);

  // Vérification spécifique pour les fichiers CSS et JS
  if (extname === ".css" || extname === ".js") {
    console.log(`Traitement d'un fichier ${extname}`);
  }

  const contentType = MIME_TYPES[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // Log l'erreur pour debug
        console.error(`Fichier non trouvé : ${filePath}`);
        res.writeHead(404);
        res.end("Fichier non trouvé");
      } else {
        // Log l'erreur pour debug
        console.error(`Erreur lors de la lecture du fichier : ${error}`);
        res.writeHead(500);
        res.end("Erreur serveur interne");
      }
    } else {
      // Log pour debug
      console.log(`Fichier servi avec succès : ${filePath}`);
      res.writeHead(200, {
        "Content-Type": contentType,
        // Ajout de headers pour désactiver le cache pendant le développement
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
