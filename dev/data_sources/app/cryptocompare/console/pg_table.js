const pg = require("pg");
const Sequelize = require("sequelize");

const dbhost = "timescaledb";
const dbport = 5432;
const dbname = "postgres";
const user_name = "postgres";
const password = "password";
const connection_string = `postgres://${user_name}:${password}@${dbhost}:${dbport}/${dbname}`;
console.log(connection_string);
const sequelize = new Sequelize(connection_string, {
  dialect: "postgres",
  protocol: "postgres",
  /*
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    */
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

let PageLoads = sequelize.define(
  "page_loads",
  {
    userAgent: { type: Sequelize.STRING, primaryKey: true },
    time: { type: Sequelize.DATE, primaryKey: true },
  },
  { timestamps: false }
);

const express = require("express");
const app = express();
const port = 3030;

app.use(express.json());

app.get('/', async (req, res) => {
  // get the user agent and current time
  const userAgent = req.get('user-agent');
  const time = new Date().getTime();
  console.log(userAgent,time);
  try {
      // insert the record
      await PageLoads.create({
          userAgent, time
      });

      // now display everything in the table
      const messages = await PageLoads.findAll();
      res.send(messages);
  } catch (e) {
      res.send('Error inserting data'+e);
  }
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))