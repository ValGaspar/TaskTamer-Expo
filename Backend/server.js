const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./src/database/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require('./src/routes/index');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve a pasta uploads de forma pública
app.use('/uploads', express.static('uploads')); 

app.use('/', routes);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Servidor TaskTamer rodando na porta ${PORT}`);
});
