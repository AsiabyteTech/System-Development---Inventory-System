const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/inventory", (req, res) => {
  db.query("SELECT * FROM Inventory", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/api/suppliers", (req, res) => {
  db.query("SELECT * FROM Supplier", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});