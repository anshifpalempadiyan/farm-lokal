import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import pool from "./config/db"
import redisClient from "./config/redis";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection()
    console.log("MySQL connected from Node.js")
    connection.release()


    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
    console.log("Redis connected")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("MySQL connection failed", error)
    process.exit(1)
  }
}


startServer()

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. shutting down...")
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("SIGNT received. shutting down...")
  process.exit(0)
})