const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const Pool = require("pg").Pool;
const env = require("dotenv");
env.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.get("/", (req, res) => {
  pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error");
      return;
    }
    console.log(result.rows);
    res.send(result.rows);
  });
});

app.listen(port, () => {
  console.log(`Postgres app listening at http://localhost:${port}`);
});
