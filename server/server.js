const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/suppliers", (req, res) => {
  db.query("SELECT * FROM Supplier ORDER BY SupplierID DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM Supplier WHERE SupplierID = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(results[0]);
  });
});

app.post("/api/suppliers", (req, res) => {
  const {
    SupplierName,
    SupplierPhoneNumber,
    SupplierAddress,
    PersonInCharge,
  } = req.body;

  const sql = `
    INSERT INTO Supplier
    (SupplierName, SupplierPhoneNumber, SupplierAddress, PersonInCharge)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [SupplierName, SupplierPhoneNumber, SupplierAddress, PersonInCharge],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Supplier added successfully",
        SupplierID: result.insertId,
      });
    }
  );
});

app.put("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;
  const {
    SupplierName,
    SupplierPhoneNumber,
    SupplierAddress,
    PersonInCharge,
  } = req.body;

  const sql = `
    UPDATE Supplier
    SET SupplierName = ?, SupplierPhoneNumber = ?, SupplierAddress = ?, PersonInCharge = ?
    WHERE SupplierID = ?
  `;

  db.query(
    sql,
    [SupplierName, SupplierPhoneNumber, SupplierAddress, PersonInCharge, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Supplier updated successfully", result });
    }
  );
});

app.delete("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Supplier WHERE SupplierID = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Supplier deleted successfully", result });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});