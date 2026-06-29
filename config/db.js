const mongoose = require('mongoose')

require('dotenv').config()

mongoose.set('strictQuery', true)

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

async function main() {
    await mongoose.connect (

        // Link para a conexão com o Banco de Dados
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.vkty6dm.mongodb.net/DB_Projeto-Integrador?appName=Cluster0`

    )

    console.log("Conectou ao banco de dados!")
}

main().catch((err) => console.log(err))

module.exports = main
