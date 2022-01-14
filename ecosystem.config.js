module.exports = {
  apps: [
    {
      name: "server",
      script: "./build/app.js",
    },
    {
      name: "worker",
      script: "./worker/build/worker/main.js",
    },
    //   {
    //     name: "discord_bot",
    //     script: "./discord_bot/build/discord_bot/main.js",
    //   },
  ],
};
