import mongoose from "mongoose"

let conn;
export const connectDB=async ()=>{
    try {
         conn=await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(conn.connection.host)
    } catch (error) {
        console.log("error :"+ error.message)
        
    }

} 