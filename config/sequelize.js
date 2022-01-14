require("dotenv").config();
const env = process.env;

module.exports = {
  development: {
    host: env.MYSQL_HOST,
    password: env.MYSQL_PASSWORD,
    username: env.MYSQL_USER,
    database: env.MYSQL_DATABASE,
    port: 3306,
    dialect: 'mariadb',
  },
  production: {
    host: env.MYSQL_HOST,
    password: env.MYSQL_PASSWORD,
    username: env.MYSQL_USER,
    database: env.MYSQL_DATABASE,
    port: 3306,
    dialect: 'mariadb',
  }
};
