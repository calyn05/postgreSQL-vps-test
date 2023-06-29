const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Client } = require("pg");
const Pool = require("pg").Pool;
const env = require("dotenv");
env.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.USER_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { results: result ? result.rows : null };
    res.send(results);
    client.release();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.get("/test", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, () => {
  console.log(`Postgres app listening at http://localhost:${port}`);
});
