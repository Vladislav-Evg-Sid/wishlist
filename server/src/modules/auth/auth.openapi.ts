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
              required: ["username", "email", "password"],

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
        "201": {
          description: "Пользователь зарегестрирован",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        "409": {
          description: "Пользователь с таким email уже существует",
        },

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["auth"],
      summary: "Авторизация пользователя",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],

              properties: {
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
          description: "Пользователь успешно авторизован",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        "401": {
          description: "Пользователь с таким email или парелем не существует",
        },

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
  "/auth/refresh": {
    post: {
      tags: ["auth"],
      summary: "Обновление токенов",

      responses: {
        "200": {
          description: "Токены успешно обновлены",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accessToken"],
                properties: {
                  accessToken: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        "401": {
          description:
            "Refresh token отсутствует, недействителен, истёк или был отозван",
        },

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["auth"],
      summary: "Выход из системы",

      responses: {
        "204": {
          description: "Сессия успешно завершена",
        },

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
};
