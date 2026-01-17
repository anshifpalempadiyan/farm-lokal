"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOTAL_RECORDS = 100000;
const BATCH_SIZE = 1000;
const categories = ["fruits", "vegetables", "grains", "dairy", "meat"];
const seedProducts = async () => {
    try {
        let inserted = 0;
        while (inserted < TOTAL_RECORDS) {
            const values = [];
            const placeholders = [];
            for (let i = 0; i < BATCH_SIZE; i++) {
                const name = ` Product ${inserted + i + 1}`;
                const description = `Description for the product ${inserted + i + 1}`;
                const category = categories[Math.floor(Math.random() * categories.length)];
                const price = (Math.random() * 500).toFixed(2);
                placeholders.push("( ?, ?, ?, ? )");
                values.push(name, description, category, price);
            }
            const sql = `
        INSERT INTO products (name , description , category , price )
        VALUES ${placeholders.join(",")}
        `;
            await db_1.default.execute(sql, values);
            inserted += BATCH_SIZE;
            console.log(` Inserted ${inserted}/${TOTAL_RECORDS}`);
        }
        console.log("Seed test reconrd inserted ");
        process.exit(0);
    }
    catch (error) {
        console.log("seeding failed ", error);
        process.exit(1);
    }
};
seedProducts();
