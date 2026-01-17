"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../config/redis"));
const webhookHandler = async (req, res) => {
    const eventId = req.body.id;
    if (!eventId) {
        return res.status(200).json({ status: "ignored" });
    }
    const key = `webhook:event:${eventId}`;
    const existing = await redis_1.default.get(key);
    if (existing) {
        console.log("Duplicate webhook iginore:", eventId);
        return res.status(200).json({ status: "ok" });
    }
    console.log("Processing webhook event:", eventId);
    await redis_1.default.set(key, "processed", {
        EX: 60 * 69 * 24
    });
    return res.status(200).json({ status: "ok" });
};
exports.default = webhookHandler;
