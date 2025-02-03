const express = require("express");
const pool = require("./db/pool"); // Import the pool

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM car_list ORDER BY created_at DESC"
    );
    console.log(result.rows);
    res.render("index", { cars: result.rows });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.render("index", { cars: [] });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
