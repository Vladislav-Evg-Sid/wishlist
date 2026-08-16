export const groupsPaths = {
  "/groups": {
    get: {
      tags: ["groups"],
      summary: "Получить все группы",

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
  },
};
