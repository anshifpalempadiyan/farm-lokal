import { Request, Response } from "express";
import redisClient from "../config/redis";

const webhookHandler = async (req: Request, res: Response) => {
    const eventId = req.body.id

    if (!eventId) {
        return res.status(200).json({ status: "ignored" })
    }

    const key = `webhook:event:${eventId}`

    const existing = await redisClient.get(key)
    if (existing) {
        console.log("Duplicate webhook iginore:", eventId)
        return res.status(200).json({ status: "ok" })
    }

    console.log("Processing webhook event:", eventId)

    await redisClient.set(key, "processed", {
        EX: 60 * 69 * 24
    })


    return res.status(200).json({ status: "ok" })
}

export default webhookHandler