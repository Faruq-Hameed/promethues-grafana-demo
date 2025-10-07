import "reflect-metadata"
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, //since it is a dev app
    logging: false,
    entities: [User],
 
})