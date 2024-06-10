import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // for encoded urls
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRouter from './routes/user.routes.js'


// routes Declaation
app.use("/api/v1/users", userRouter)     // users pass the control to the userRouter


// http://localhost:8000/api/v1/users/register



export { app };
