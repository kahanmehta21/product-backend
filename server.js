const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");


const STATIC_USER = {
  username: "admin",
  password: "admin123"
};

const app = express();
app.use(cors());
const port = 3001;
const JWT_SECRET = "mysecret";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "mysql-kahan-3750-lion-6321.j.aivencloud.com",
  port: 18672,
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "defaultdb",
  ssl: {
    ca: fs.readFileSync("ca.pem"),
  }
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.put("/products/:id", (req, res) => {
    const { name, price, description, imageUrl } = req.body;
    const sql = `
      UPDATE Products
      SET prod_name = ?, price = ?, description = ?, image_url = ?
      WHERE product_id = ?
    `;
    pool.query(sql, [name, price, description, imageUrl, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send("Product updated");
    });
  });

  app.delete("/products/:id", (req, res) => {
    const sql = "DELETE FROM Products WHERE product_id = ?";
    pool.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send("Product deleted");
    });
  });

  app.get("/products", (req, res) => {
    const sql = "SELECT product_id, prod_name, price, description, imageID AS image_url FROM Products";
    pool.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  });
  
  
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
