import { authPaths } from "../modules/auth/auth.openapi.js";
import { groupsPaths } from "../modules/groups/groups.openapi.js";
import { wishlistsPaths } from "../modules/wishlist/wishlists.openapi.js";
import { config } from "./env.js";

export const swaggerDocument = {
  openapi: "3.0.3",

  info: {
    title: "Wishlist API",
    version: "1.0.0",
    description: "Backend API for Wishlist application",
  },

  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: "Development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },

      refreshCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
      },
    },
  },

  paths: {
    ...groupsPaths,
    ...wishlistsPaths,
    ...authPaths,
  },
};
