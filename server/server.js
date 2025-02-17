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
  // Gestion de la route racine '/'
  if (req.url === "/") {
    const indexPath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(indexPath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end("Erreur lors du chargement de index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
    return;
  }

  // Route pour les fichiers statiques
  let filePath = path.join(__dirname, "..", "public", req.url);
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404);
        res.end("Fichier non trouvé");
      } else {
        res.writeHead(500);
        res.end("Erreur serveur interne");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
