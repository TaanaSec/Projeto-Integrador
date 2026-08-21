const express = require('express')
const cors = require('cors')

require("./config/db")

const loginRoutes = require('./routes/loginRoutes')
const adminRoutes = require('./routes/adminRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const relatoriosRoutes = require('./routes/relatoriosRoutes')
const produtoRoutes = require('./routes/produtoRoutes')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3000

// Cria uma rota GET para o caminho "/"
app.get("/", (req, res) => {
    res.status(200).send("Bem-vindo à API integrado ao FrontEnd - CRUD Completo!")
})


// Rota de Login Cadastro e Dashboards
app.use("/", loginRoutes)
app.use('/api', adminRoutes)
app.use("/api", dashboardRoutes)
app.use("/api", relatoriosRoutes)
app.use('/api', produtoRoutes)
app.use('/uploads', express.static('uploads'))


app.listen(PORT, () => {
    console.log(`Servidor de tarefas rodando na porta ${PORT}`);
})
