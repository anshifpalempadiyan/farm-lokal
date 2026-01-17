"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const oauth_service_1 = __importDefault(require("./oauth.service"));
const MAX_RETRIES = 3;
const externalApiA = async () => {
    const token = await (0, oauth_service_1.default)();
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await axios_1.default.get("https://jsonplaceholder.typicode.com/posts", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 5000
            });
            return response.data;
        }
        catch (error) {
            attempt++;
            console.warn(` External API retry ${attempt} `);
            if (attempt >= MAX_RETRIES) {
                console.error("External API A failed after retries ", error);
                throw error;
            }
            await new Promise((res) => setTimeout(res, attempt * 1000));
        }
    }
};
exports.default = externalApiA;
