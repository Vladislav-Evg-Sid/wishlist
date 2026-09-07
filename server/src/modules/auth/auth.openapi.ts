export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["auth"],
      summary: "Регистрация пользователя",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["гыуктфьу", "email", "password"],

              properties: {
                username: {
                  type: "string",
                  example: "Иван",
                },

                email: {
                  type: "string",
                  format: "email",
                  example: "ivan@example.com",
                },

                password: {
                  type: "string",
                  format: "password",
                  example: "strongPassword123",
                },
              },
            },
          },
        },
      },

      responses: {
        "200": {
          description: "Пользователь зарегестрирован",
        },
      },
    },
  },
};
