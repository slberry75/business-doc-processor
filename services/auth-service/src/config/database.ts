import process from "process";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import logger from "./logger";
import { CustomTypeOrmLogger } from "./typeormlogger";


logger.sql('Database configuration validated', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  environment: process.env.NODE_ENV,
  // In production, hide even the username
  username: process.env.NODE_ENV === 'production' ? '[REDACTED]' : process.env.DB_USERNAME,
  password: '[REDACTED]'
});

export const AuthDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    logger: new CustomTypeOrmLogger()
})
