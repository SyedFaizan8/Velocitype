import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes";
import userUpdate from "./routes/update.routes";
import errorHandler from "./middlewares/errorHandler";

app.use("/api", userRouter);
app.use("/api/user", userUpdate);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
