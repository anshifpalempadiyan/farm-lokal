"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const redis_1 = __importDefault(require("./config/redis"));
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const connection = await db_1.default.getConnection();
        console.log("MySQL connected from Node.js");
        connection.release();
        if (!redis_1.default.isOpen) {
            await redis_1.default.connect();
        }
        console.log("Redis connected");
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.log("MySQL connection failed", error);
        process.exit(1);
    }
};
startServer();
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. shutting down...");
    process.exit(0);
});
process.on("SIGINT", async () => {
    console.log("SIGNT received. shutting down...");
    process.exit(0);
});
