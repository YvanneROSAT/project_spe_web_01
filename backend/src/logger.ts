import winston from "winston";

export default winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV !== "dev"
      ? [
          new winston.transports.File({
            filename: "app.log",
            format: winston.format.json(),
          }),
        ]
      : []),
  ],
});
