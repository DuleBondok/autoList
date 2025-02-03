const express = require("express");
const pool = require("./db/pool"); // Import the pool

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM car_list ORDER BY make ASC"
    );
    console.log(result.rows);
    res.render("index", { cars: result.rows });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.render("index", { cars: [] });
  }
});

app.get("/new", (req,res) => {
  res.render("newCar");
});

app.post("/new", async(req,res) => {
  const {carMake, carModel, carYear, carPrice, carMileage, carHorsepower, carFuel, carColor, carDescription, carMakeImage, carImageUrl} = req.body;
  try {
    const query = `INSERT INTO car_list (make, model, year, price, mileage, horsepower, fuel_type, color, description, image, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

    const values = [carMake, carModel, carYear, carPrice, carMileage, carHorsepower, carFuel, carColor, carDescription, carMakeImage, carImageUrl];
    
    await pool.query(query, values);

    console.log("New car added sucessfully!");
    res.redirect("/");
  }
  catch(err) {
    console.log("Error adding car", err);
    res.send("Error adding car");
  }
})

app.get("/category/:make", async(req,res) => {
  const carMake= req.params.make;
  try {
    const result = await pool.query("SELECT * FROM car_list WHERE make = $1", [carMake]);
    res.render("category", {make: carMake, cars: result.rows});
  }
  catch(err) {
    console.error("Error fetching cars by make:", err);
    res.send("Error fetching cars");
  }
})

app.delete("/delete/:id", async (req, res) => {
  const carId = req.params.id;
  const {password} = req.body;

  const ADMIN_PASSWORD = "deletecar";

  if(password != ADMIN_PASSWORD){
    return res.status(403).send("Incorrect password!");
  }
  try {
      await pool.query("DELETE FROM car_list WHERE id = $1", [carId]);
      res.status(200).send("Car deleted successfully");
  } catch (err) {
      console.error("Error deleting car:", err);
      res.status(500).send("Error deleting car");
  }
});

app.get("/search", async (req, res) => {
  const searchQuery = req.query.query;
  try {
      const result = await pool.query(
          "SELECT * FROM car_list WHERE make ILIKE $1 OR model ILIKE $1",
          [`%${searchQuery}%`]
      );
      res.render("search", { cars: result.rows });
  } catch (err) {
      console.error("Error fetching search results:", err);
      res.send("Error fetching search results");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
