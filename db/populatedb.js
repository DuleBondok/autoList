const { Client } = require("pg");

const client = new Client({
  user: "dulebondok",
  host: "localhost",
  database: "car_list",
  password: "dusansrbija1",
  port: 5432,
});

const SQL = `CREATE TABLE IF NOT EXISTS car_list (
    id SERIAL PRIMARY KEY,
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    price DECIMAL(10, 2),
    mileage INT,
    horsepower INT,
    fuel_type VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
)`;

const cars = [
  {
    make: "Volkswagen",
    model: "Golf 7",
    year: 2018,
    price: 14500.0,
    mileage: 90000,
    horsepower: 116,
    fuel_type: "Diesel",
    color: "White",
    description:
      "Slightly used Golf 7 looking for a new owner. All repairs done on time. Navigation, leather seats and large multimedia.",
    image: "volkswagen.png",
  },
  {
    make: "Opel",
    model: "Corsa C",
    year: 2003,
    price: 1300.0,
    mileage: 230000,
    horsepower: 75,
    fuel_type: "Diesel",
    color: "Black",
    description:
      "Opel Corsa for sale. It has automatic AC, multifunctional steering wheel and new winter tires. Paint in excellent condition. Small and economic city car.",
    image: "opel.png",
  },
];

async function populateDatabase() {
  try {
    await client.connect(); // ✅ Connect to the database
    console.log("Connected to database");

    // ✅ Create the table if it doesn’t exist
    await client.query(SQL);
    console.log("Table checked/created successfully");

    for (let car of cars) {
      const query = `INSERT INTO car_list (make, model, year, price, mileage, horsepower, fuel_type, color, description, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

      const values = [
        car.make,
        car.model,
        car.year,
        car.price,
        car.mileage,
        car.horsepower,
        car.fuel_type,
        car.color,
        car.description,
        car.image,
      ];

      await client.query(query, values);
      console.log(`Car ${car.make} ${car.model} added successfully`);
    }
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end(); // ✅ Ensure the client connection is closed
    console.log("Database connection closed");
  }
}

populateDatabase();
