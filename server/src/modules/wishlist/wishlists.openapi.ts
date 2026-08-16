export const wishlistsPaths = {
  "/wishlists/{id}": {
    get: {
      tags: ["wishlists"],
      summary: "Получить вишлисты группы",

      parameters: [
        {
          in: "path",
          name: "id",
          required: true,

          schema: {
            type: "integer",
          },
        },
      ],

      responses: {
        "200": {
          description: "Вишлисты получены",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
