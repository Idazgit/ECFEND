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
  console.log(`Requête reçue : ${req.url}`);

  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Gestion de la route racine '/'
  if (req.url === "/") {
    const indexPath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(indexPath, (error, content) => {
      if (error) {
        console.error(
          `Erreur lors du chargement de index.html : ${error.message}`
        );
        res.writeHead(500);
        res.end("Erreur lors du chargement de index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
    return;
  }

  // Déterminer le chemin du fichier en fonction de son type
  let filePath;
  if (req.url.startsWith("/img/")) {
    // Pour les images, chercher directement dans le dossier img à la racine
    filePath = path.join(__dirname, "..", req.url);
    console.log(req.url, "hello");
  } else {
    // Pour les autres fichiers statiques, chercher dans public
    filePath = path.join(__dirname, "..", "public", req.url);
  }

  const extname = path.extname(filePath);
  console.log(`Tentative d'accès au fichier : ${filePath}`);
  console.log(`Extension détectée : ${extname}`);

  const contentType = MIME_TYPES[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        console.error(`Fichier non trouvé : ${filePath}`);
        res.writeHead(404);
        res.end("Fichier non trouvé");
      } else {
        console.error(`Erreur lors de la lecture du fichier : ${error}`);
        res.writeHead(500);
        res.end("Erreur serveur interne");
      }
    } else {
      res.writeHead(200, {
        "Content-Type": contentType,
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
