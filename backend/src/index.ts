import express from "express";
import rootRouter from "./routes/index";
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();

app.use('/api/v1',rootRouter);
app.use(cors());
app.use(express.json());


app.listen(3000,()=>{
    console.log('werks');
});