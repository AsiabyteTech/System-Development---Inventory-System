const db = require("./db");

db.query("SHOW TABLES", (err, results) => {
  if (err) {
    console.error("❌ Query failed:", err.message);
    return;
  }

  console.log("✅ Tables:");
  console.log(results);

  db.end();
});