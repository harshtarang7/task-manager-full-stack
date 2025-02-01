import express from "express";
import { DBSource } from "./config/db.config";

const app = express();

DBSource ? "connected" : "not"


app.get("/run", (req, res) => {
  res.send("API is running");
});


app.listen(3000, ()=>{
    console.log("server is running succesfully")
})