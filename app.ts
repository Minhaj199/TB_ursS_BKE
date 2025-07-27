import express from "express";
import cors from "cors";
import { erroHandler } from "./src/middlewares/errorHandler";
import { router } from "./src/router/router";
import morgan from "morgan";
import { dbConnection } from "./src/config/mongoDB";
import { server } from "./src/config/server";
import { job } from "./src/utils/cronjob";

export const app = express();

const corsOpetion = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  exposedHeaders: ["authorizationforuser"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));

///loger///
app.use(morgan("tiny"));

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
