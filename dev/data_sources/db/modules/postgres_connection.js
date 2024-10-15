import Sequelize from "sequelize";

export function connection(config) {
  const connection_string = `postgres://${config.USER_NAME}:${config.PASSWORD}@${config.HOST}:${config.PORT}/${config.DBNAME}`;
  return new Sequelize(connection_string, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      //client_encoding: ["UTF8", "WIN1251", "LATIN1", "LATIN2"],
      //client_encoding: "WIN1251",
      //client_encoding: "LATIN1",
      /*
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      */
    },
  });
}

