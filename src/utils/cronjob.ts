//////////////deleting after 3000 days////////////

import { CronJob } from "cron";
import urlModel from "../model/urlModel";
import { env } from "../config/env";

export const job = new CronJob(env.CRON_JOB_INTERVEL, async () => {
  try {
    await urlModel.deleteMany({
      expiresAt: { $lte: new Date() },
    });
  } catch {}
});
