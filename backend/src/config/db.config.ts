import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "../data-models/user/user.entity";

dotenv.config();

export const DBSource = new DataSource({
    type:"mysql",
    host:process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    entities:[UserEntity]
})

DBSource.initialize()
.then(()=>{
    console.log("Database is connected successfully")
})
.catch((error)=>{
    console.log("Error while connecting to the Database",error)
})