const fs = require("fs");

const currDir = process.cwd();
// This file assumes that it will be run automatically with npm install.
// Do *not* run it in any other directory

const env = {
  HOME_DIR: currDir,
  CLIENT_HOSTNAME: "http://localhost:3000",
  CORS_HOSTNAME: "http://localhost:3000",
  JWT_SECRET: "sometestjwtsecret",
  MYSQL_USER: "app_user",
  MYSQL_HOST: "mysql",
  MYSQL_PASSWORD: "hello_world",
  MYSQL_DATABASE: "app_db",
  REDIS_HOST: "redis",
  REDIS_PORT: "6379",
  REDIS_PASSWORD: "",
  REDIS_URL: "",
  UPLOAD_S3_SECRET: "",
  UPLOAD_S3_KEY: "",
  UPLOAD_BUCKET: "",
  UPLOAD_REGION: "",
  ENCODE_SECRET: "SOMERANDOMSECRET",
  ENCODE_IV: "SOMERANDOMIV",
};

const envFilePath = currDir + "/.env";
fs.stat(envFilePath, (err, stats) => {
  if (stats && stats.isFile) {
    console.log("Not writing .env because it exists already");
  }
});

const outputEnvString = Object.keys(env).reduce((memo, key) => {
  return memo + key + "=" + env[key] + "\n";
}, "");

fs.writeFile(envFilePath, outputEnvString, "utf8", (err) => {
  if (err) {
    console.error(
      "[ERROR] There was an error generating your .env file. Please double check your .env file before running docker."
    );
  } else {
    console.log("\x1b[32m", "Successfully generated env file: " + envFilePath);
  }
});
