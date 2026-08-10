import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Express learning API",
      version: "1.0.0",
    },

    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },

  apis: ["./src/**/*.ts"],
});