const net = require("net")
const PORT = 5001

const server = net.createServer((socket) => {
    console.log("Client connected")

    socket.on("data", (data) => {
        response = JSON.parse(data)
        if (response.request == "echo"){
            socket.write(`Hello ${response.params.text}`)
        }
    })

    socket.on("end", () => {
        console.log("Client logout")
    })
})

server.listen(PORT, () => {
    console.log(`RPC Server running on port ${PORT}`)
})