import cluster from "cluster";
import os from "os";
import { app } from "../../app";
import { job } from "../utils/cronjob";
import { env } from "./env";

export const server = () => {
  if (cluster.isPrimary) {
    const cores = os.cpus().length;
    for (let i = 0; i < cores; i++) cluster.fork();
    job.start()
  } else {
    app.listen(env.PORT, () => console.log(`Worker ${process.pid} running`));
  }
};
