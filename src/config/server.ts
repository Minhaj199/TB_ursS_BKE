import cluster from "cluster";
import os from "os";
import { app } from "../../app";

export const serever = () => {
  if (cluster.isPrimary) {
    const cores = os.cpus().length;
    for (let i = 0; i < cores; i++) cluster.fork();
  } else {
    app.listen(3000, () => console.log(`Worker ${process.pid} running`));
  }
};
