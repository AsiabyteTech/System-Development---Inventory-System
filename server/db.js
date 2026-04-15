require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "inventoryproject.cp6ektunmgpv.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "5GqokJgPqo7MOiUJKlHt",
  database: "inventory_db",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL connected successfully");
});

module.exports = connection;