import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import pool from "./config/db"


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection()
    console.log("MySQL connected from Node.js")
    connection.release()

    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.log("MySQL connection failed" , error )
    process.exit(1)
  }
}


startServer()