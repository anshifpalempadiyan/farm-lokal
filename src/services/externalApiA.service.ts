import axios from "axios"
import getAccessToken from "./oauth.service"

const MAX_RETRIES = 3

const externalApiA = async () => {
    const token = await getAccessToken()

    let attempt = 0

    while (attempt < MAX_RETRIES) {

        try {
            const response = await axios.get(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 5000
                }
            )
            return response.data
        } catch (error) {
            attempt++
            console.warn(` External API retry ${attempt} `)

            if (attempt >= MAX_RETRIES) {
                console.error("External API A failed after retries ", error)
                throw error
            }

            await new Promise((res) => setTimeout(res, attempt * 1000))
        }

    }
}

export default externalApiA