import winston from "winston";

import path from "path";

const logDir = "src/errors";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "errorLog.log"),
    }),
  ],
});
export default logger;
