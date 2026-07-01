const express = require('express')
const cors = require('cors')
require("./config/db")
const loginRoutes = require('./routes/loginRoutes')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3000

// Cria uma rota GET para o caminho "/"
app.get("/", (req, res) => {
    res.status(200).send("Bem-vindo à API integrado ao FrontEnd - CRUD Completo!")
})


// Rota de Login e Cadastro
app.use("/", loginRoutes)



app.listen(PORT, () => {
    console.log(`Servidor de tarefas rodando na porta ${PORT}`);
})