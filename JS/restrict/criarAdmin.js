const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config();

const Admin = require('../../models/adminModel');

async function criarAdmin() {

    try {

        await mongoose.connect(
            `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-4kplagn-shard-00-00.vkty6dm.mongodb.net:27017,ac-4kplagn-shard-00-01.vkty6dm.mongodb.net:27017,ac-4kplagn-shard-00-02.vkty6dm.mongodb.net:27017/DB_Projeto-Integrador?ssl=true&replicaSet=atlas-80gkzk-shard-0&authSource=admin&appName=Cluster0`
        );

        console.log('Conectado ao MongoDB.');


        const email = 'admin@emporio.com';
        const senha = 'Admin123';
        const nome = 'Administrador';


        const adminExistente = await Admin.findOne({
            email
        });

        if (adminExistente) {

            console.log('Administrador já existe.');

            await mongoose.disconnect();

            return;
        }


        const senhaHash = await bcrypt.hash(
            senha,
            12
        );


        const novoAdmin = new Admin({

            nome,
            email,
            senha: senhaHash

        });


        await novoAdmin.save();


        console.log('Administrador criado com sucesso!');
        console.log('Email:', email);
        console.log('Senha:', senha);


        await mongoose.disconnect();

    } catch (erro) {

        console.error(
            'Erro ao criar administrador:',
            erro
        );

        await mongoose.disconnect();
    }
}


criarAdmin();