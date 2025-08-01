const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./src/database/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; 

const routes = require('./src/routes/index');

app.use(cors());
app.use(express.json());
app.use('/', routes);


connectToDatabase();

app.listen(PORT, () =>{
    console.log(`Servidor TaskTamer rodando na porta ${PORT}`);
});