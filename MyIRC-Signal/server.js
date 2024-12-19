const net = require("net")

const PORT = 6667
let clients = []

const server = net.createServer((socket) => {
    socket.write("Pseudo: ")
    let chaine = ""

    socket.on("data", (data) => {
        const character = data.toString()
        chaine += character
        if (chaine.includes("\n")){ // touche entrée -> trigger
            client = clients.find((client) => client.socket == socket)
            if (chaine.trim() == "/list"){
                clients.forEach(c => {
                    socket.write(`${c.name}\n\r`)
                });
            } else if (chaine.includes("/whisper") && client) {
                const [command, username, ...chaineSplitee] = chaine.split(' ')
                targetClient = clients.find((c) => c.name == username)
                if (targetClient){
                    targetClient.socket.write(`[Whisper] [${client.name}] ${chaineSplitee.join(' ')}`)
                } else {
                    socket.write("Utilisateur non trouve\n\r")
                }
            } else if (client) {
                broadcast(`[${client.name}] ${chaine}`)
            } else {
                chaine = chaine.trim()
                clients.push({socket, name: chaine, channel: "global"})
                socket.write("\n\rVous avez rejoint le chat\n\r")
                broadcast(`\n\r${chaine} a rejoint le chat\n\r`, socket) 
            }
            chaine = ""
        }
    })

    socket.on("end", () => {
        client = clients.find((client) => client.socket == socket)
        if (client){
            broadcast(`${client.name} a quitté le chat\n\r`, socket)
            const index = clients.indexOf(client)
            clients.splice(index, 1)
        }
    })

    socket.on("error", (error) => {
        console.log(error)
        client = clients.find((client) => client.socket == socket)
        if (client){
            broadcast(`${client.name} a quitte le chat\n\r`, socket)
            const index = clients.indexOf(client)
            clients.splice(index, 1)
        }
    })
})

function broadcast(message, senderSocket) {
    clients.forEach((client) => {
      if (client.socket !== senderSocket) {
        client.socket.write(message)
      }
    })
}

async function handleSignal(signal){
    broadcast("Le serveur va s'arrreter dans 5 secondes", null)
    setTimeout(() => {
        clients.forEach((client) => {
            client.socket.end()
        })
        server.close()
    }, 5000)
}

process.on("SIGINT", () => handleSignal("SIGINT"));

server.listen(PORT, () => {
    console.log(`RPC Server running on port ${PORT}`)
})