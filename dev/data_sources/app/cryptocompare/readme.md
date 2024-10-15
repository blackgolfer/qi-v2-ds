# Database Table Schema

This is the javascript implementation of the article [How to Analyze Cryptocurrency Market Data using TimescaleDB, PostgreSQL and Tableau: a Step-by-Step Tutorial](https://www.timescale.com/blog/tutorials-how-to-analyze-cryptocurrency-market-data-using-timescaledb-postgresql-and-tableau-a-step-by-step-tutorial/).

- schema.md: schema description
- schema.sql: sql script for creating tables in postgre database
- create_tables.js: javascript to create tables
- modules/postgres_connection.js: helper for connecting to postgres database

## Workflow

- defining sql script in schema.sql for creating tables
- run create_tables.js to create tables and hypertables
  ```bash
  node create_table
  ```
- creating sequelize models from tables using [sequelize-auto](https://github.com/sequelize/sequelize-auto)

  ```bash
  npx sequelize-auto -o "./models" -d postgres -h timescaledb -u postgres -p 5432 -x password -e postgres -t btc_prices -t eth_prices -t crypto_prices -t currency_info
  ```

  This will generate the following files under `models` directory:

  - `btc_prices.js`: model for `btc_prices` table
  - `eth_prices.js`: model for `eth_prices` table
  - `crypto_prices.js`: model for `crypto_prices` table
  - `currency_info.js`: model for `currency_info` table
  - `init-models.js`: utililty for using models, a sample usage as shown below:

    ```js
    var initModels = require("./models/init-models");
    ...
    var models = initModels(sequelize);

    models.btc_prices.findAll({ where: { currency_code: "USD" }}).then(...);
    ```

- injest data into tables
