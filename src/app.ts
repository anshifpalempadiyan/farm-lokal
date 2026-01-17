import express from "express";
import getAccessToken from "./services/oauth.service"
import externalApiA from "./services/externalApiA.service";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.get("/test-oauth", async (req, res) => {
  try {
    const token = await getAccessToken()
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "OAuth failed" })
  }
})

app.get("/test-external-a", async ( req , res ) => {
  try {
    const data = await externalApiA()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: " external API A failed "})
  }
})



export default app;
