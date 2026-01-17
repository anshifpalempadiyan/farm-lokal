"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const redis_1 = __importDefault(require("../config/redis"));
const cacheKey_1 = require("../utils/cacheKey");
const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const category = req.query.category || undefined;
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
        const sort = req.query.sort || "price_asc";
        const cacheKey = (0, cacheKey_1.buildCacheKey)("products", req.query);
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            console.log("Serving from Redis cache");
            return res.json(JSON.parse(cached));
        }
        console.log("Cache miss Querying DB ");
        const conditions = [];
        const values = [];
        if (category) {
            conditions.push("category = ?");
            values.push(category);
        }
        if (minPrice) {
            conditions.push("price >= ?");
            values.push(minPrice);
        }
        if (maxPrice) {
            conditions.push("price <= ?");
            values.push(maxPrice);
        }
        const whereclause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        let orderBy = "price ASC";
        if (sort === "price_desc")
            orderBy = "price DESC";
        if (sort === "created_desc")
            orderBy = "createdAt DESC";
        if (sort === "created_asc")
            orderBy = "createdAt ASC";
        const sql = `
    SELECT id, name , description, category, price , createdAt
    FROM products 
    ${whereclause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
    `;
        values.push(limit, offset);
        const [rows] = await db_1.default.query(sql, values);
        const response = { page, limit, count: rows.length, data: rows };
        await redis_1.default.set(cacheKey, JSON.stringify(response), { EX: 60 });
        console.log("Cached products response");
        return res.json(response);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Failed to fetch products " });
    }
};
exports.default = getProducts;
