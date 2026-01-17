import axios from "axios";
import redisClient from "../config/redis";
import { resolve } from "node:dns";

const TOKEN_KEY = "oauth:access_token"
const LOCK_KEY = "oauth:token_lock"
const LOCK_TTL = 10
const EXPIRY_BUFFER =60


interface oAuthTokenResponse {
    access_token: string
    expires_in: number
}

const sleep = ( ms: number) => 
    new Promise((resolve) => setTimeout(resolve, ms))

const getAccessToken = async (): Promise<string> => {

    const cachedToken = await redisClient.get(TOKEN_KEY)
    if (cachedToken) {
        return cachedToken
    }

    const lockAcquired = await redisClient.set(
        LOCK_KEY,
        "locked",
        { NX: true, EX:LOCK_TTL }
    )

    if ( !lockAcquired ) {
        await sleep(500)
        return getAccessToken()
    }

    try {
        const response = await axios.post<oAuthTokenResponse>(
            process.env.OAUTH_TOKEN_URL!,
            {
                grant_type: "client_credentials",
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                scope: process.env.OAUTH_SCOPE
            },
            { timeout: 5000 }
        )

        const { access_token , expires_in} = response.data
        

        const ttl= expires_in - EXPIRY_BUFFER
        await redisClient.set(TOKEN_KEY, access_token, { EX:ttl })

        return access_token
    } finally {
        await redisClient.del( LOCK_KEY )
    }
}

export default getAccessToken