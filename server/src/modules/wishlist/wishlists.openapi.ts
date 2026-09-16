export const wishlistsPaths = {
  "/wishlists/{groupID}": {
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
  "/wiwishlists": {
    post: {
      tags: ["wishlists"],
      summary: "Создание вишлиста",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["group_id", "name"],

              properties: {
                group_id: {
                  type: "string",
                  example: "00000000-0000-0000-0000-000000000000",
                },
              },
            },
          },
        },
      },

      responses: {
        "201": {
          description: "Вишлист успешно создан",
          content: {
            "text/plain": {
              schema: {
                type: "string",
              },
            },
          },
        },

        "401": {
          description: "Неавтоирзован",
        },

        "403": {
          description: "User not a member or creator",
        },

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
};
