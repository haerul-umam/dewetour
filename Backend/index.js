require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")


const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

require("./src/socket")(io)

app.use(express.json())
app.use(cors())

const router = require("./src/route")
app.use("/static", express.static(path.join(__dirname,"public")))
app.use("/api/v1/", router)

const {port} = require("./_helper/var")
server.listen(port, () =>{
    console.info(`Server is running at http://127.0.0.1:${port}`)
})

