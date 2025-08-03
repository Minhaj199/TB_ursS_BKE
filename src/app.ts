import express from "express";
import cors from "cors";
import { erroHandler } from "./middlewares/errorHandler";
import { router } from "./router/router";
import morgan from "morgan";
import { dbConnection } from "./config/mongoDB";
import { job } from "./utils/cronjob";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import { server } from "./config/server";

export const app = express();

const corsOpetion = {
  origin: [env.FROTENT_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  exposedHeaders: ["authorizationforuser"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));
app.use(cookieParser());
///loger///
app.use(morgan("common"));

/// routes//////

app.use("/api", router);

////////////server///////////
server();


///////////// db connection
dbConnection();

/////////////crone job//////////////////
job.start();

///////////global error handler/////////////
app.use(erroHandler);
