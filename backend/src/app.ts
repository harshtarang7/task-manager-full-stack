import express from "express";
import { DBSource } from "./config/db.config";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

// routes
app.use('/api/auth',authRouter)

DBSource.initialize()
.then(()=>{
  app.listen(3000, ()=>{
      console.log("server is running succesfully")
  });
})
.catch(console.error);