export const groupsPaths = {
  "/groups": {
    get: {
      tags: ["groups"],
      summary: "Получить все группы",

      parameters: [
        {
          in: "path",
          name: "userID",
          required: true,

          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Гуппы получены",
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
    post: {
      tags: ["groups"],
      summary: "Создание группы",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["group_name"],

              properties: {
                group_name: {
                  type: "string",
                  example: "Семья",
                },
              },
            },
          },
        },
      },

      responses: {
        "201": {
          description: "Группа успешно создана",
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

        "500": {
          description: "Внутренняя ошибка сервера",
        },
      },
    },
  },
};
