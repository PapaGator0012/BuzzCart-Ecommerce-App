// connects our Application to mongoDB database 

const mongoose = require("mongoose");
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB Connected Successfully!!")
    } catch (err) {
        console.error("MONGODB connection failed")
        process.exit(1)
    }
}

module.exports = connectDB;