import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import scrapperRouter from "./modules/scrapper/scrapper.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/scrapper", scrapperRouter);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT}`);
});
