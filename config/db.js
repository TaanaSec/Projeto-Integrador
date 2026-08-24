const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', true)

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

async function main() {
    await mongoose.connect (
        `mongodb://${dbUser}:${dbPassword}@ac-4kplagn-shard-00-00.vkty6dm.mongodb.net:27017,ac-4kplagn-shard-00-01.vkty6dm.mongodb.net:27017,ac-4kplagn-shard-00-02.vkty6dm.mongodb.net:27017/DB_Projeto-Integrador?ssl=true&replicaSet=atlas-80gkzk-shard-0&authSource=admin&appName=Cluster0`
    )

    console.log("Conectou ao banco de dados!")
}

main().catch((err) => console.log(err))

module.exports = main
