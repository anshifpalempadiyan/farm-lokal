"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oauth_service_1 = __importDefault(require("./services/oauth.service"));
const externalApiA_service_1 = __importDefault(require("./services/externalApiA.service"));
const webhook_controller_1 = __importDefault(require("./modules/webhook.controller"));
const products_controller_1 = __importDefault(require("./controllers/products.controller"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/test-oauth", async (req, res) => {
    try {
        const token = await (0, oauth_service_1.default)();
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "OAuth failed" });
    }
});
app.get("/test-external-a", async (req, res) => {
    try {
        const data = await (0, externalApiA_service_1.default)();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: " external API A failed " });
    }
});
app.post("/webhook/external-b", webhook_controller_1.default);
app.get("/products", products_controller_1.default);
app.use(error_middleware_1.default);
exports.default = app;
