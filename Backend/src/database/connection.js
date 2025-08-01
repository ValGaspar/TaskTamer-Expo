const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const connectToDatabase = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado ao MongoDB com sucesso!");
    } catch(error){
        console.error("Erro ao conectar ao MongoDB: ", error);
    }
};

module.exports = connectToDatabase;