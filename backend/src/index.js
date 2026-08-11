import express from "express"
import authroutes from "./routes/auth.routes.js";
import messageroutes from "./routes/message.routes.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app ,  server  } from "./lib/socket.js";
import bodyParser from "body-parser";


dotenv.config();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authroutes)
app.use("/api/messages",messageroutes)

server.listen(3001 ,()=>{
    console.log("server is running ");
    connectDB();
})

 