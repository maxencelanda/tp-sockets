const { request } = require("http");
const net = require("net");

const PORT = 5001;

// Connexion au serveur
const client = net.createConnection(PORT, "localhost", () => {
  console.log("--- Connecté au serveur.");

  // Requête pour appeler le serveur avec votre nom.
  response = JSON.stringify({
    "request": "echo",
    "params": {
        "text": "me"
    }
  })
  client.write(response);
});

// Réception des réponses du serveur RPC    
client.on("data", (data) => {
  const response = data.toString();

  console.log(response);
  client.end(); // Terminer la connexion après la réponse
});

client.on("end", () => {
  console.log("--- Déconnecté du serveur.");
});
