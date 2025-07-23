import winston from "winston";

export default winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "app.log",
      level: "error",
    }),
  ],
});
