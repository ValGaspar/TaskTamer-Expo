const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskTamer API",
      version: "1.0.0",
      description: "Documentação da API do TaskTamer",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger disponível em /docs");
}

module.exports = swaggerDocs;
