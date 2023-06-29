const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Client } = require("pg");
const Pool = require("pg").Pool;
const env = require("dotenv");
env.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.USER_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/api/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { data: result ? result.rows : null };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results));

    client.release();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM users WHERE id = ${req.params.id}`
    );
    const results = { data: result ? result.rows : null };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results));

    client.release();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO users (name, email) VALUES ('${req.body.name}', '${req.body.email}')`
    );
    const results = { data: result ? result.rows : null };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results));

    client.release();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM users WHERE id = ${req.params.id}`
    );
    const results = { data: result ? result.rows : null };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results));

    client.release();
  } catch (err) {
    res.send("Error " + err);
  }
});

app.get("/", (req, res) => {
  res.send("Hello, world! This is a Postgres app.");
});

app.listen(port, () => {
  console.log(`Postgres app listening at http://localhost:${port}`);
});
