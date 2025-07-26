import express from "express";
import cors from "cors";

import { erroHandler } from "./src/middlewares/errorHandler";
import { router } from "./src/router/router";
import morgan from "morgan";
import logger from "./src/middlewares/winston";
import { dbConnection } from "./src/config/mongoDB";
import { env } from "./src/config/env";

const app = express();

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

const port =env.PORT
if (port) {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
} else {
  logger.error({
    message: "port not found",
    time: new Date().toISOString(),
  });
  process.exit(1);
}

    dbConnection()
    


///////////global error handler/////////////
app.use(erroHandler);
