"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../config/redis"));
const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:token_lock";
const LOCK_TTL = 10;
const EXPIRY_BUFFER = 60;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getAccessToken = async () => {
    const cachedToken = await redis_1.default.get(TOKEN_KEY);
    if (cachedToken) {
        return cachedToken;
    }
    const lockAcquired = await redis_1.default.set(LOCK_KEY, "locked", { NX: true, EX: LOCK_TTL });
    if (!lockAcquired) {
        await sleep(500);
        return getAccessToken();
    }
    try {
        const response = await axios_1.default.post(process.env.OAUTH_TOKEN_URL, {
            grant_type: "client_credentials",
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            scope: process.env.OAUTH_SCOPE
        }, { timeout: 5000 });
        const { access_token, expires_in } = response.data;
        const ttl = expires_in - EXPIRY_BUFFER;
        await redis_1.default.set(TOKEN_KEY, access_token, { EX: ttl });
        return access_token;
    }
    finally {
        await redis_1.default.del(LOCK_KEY);
    }
};
exports.default = getAccessToken;
