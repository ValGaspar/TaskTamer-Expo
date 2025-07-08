const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; 

const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(PORT, () =>{
    console.log(`Servidor TaskTamer rodando na porta ${PORT}`);
});