const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const subscriberRoute = require("./routes/subscriberRoute")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes")
const adminOrderRoutes = require("./routes/adminOrderRoutes")
const app = express();
app.use(express.json());

const corsOptions={
    origin:(origin,callback)=>{
        const allowedorigins =[
            `https://buzz-cart-ecommerce-app-iq5h.vercel.app`,
            `http://localhost:5173`,process.env.FRONTEND_URL,
        ];
        if(!origin || allowedorigins.includes(origin)){
            callback(null,true);
            console.log("allowedOrigin:",origin)
        }else{
            callback(new Error("Not Allowed by CORS"))
        }

    },
    methods:['GET','POST','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-type','Authorization'],credentials:true,

}



app.use(cors(corsOptions));

dotenv.config()
const PORT = process.env.PORT || 9000  ;
// ............................
// connect to MongoDB 
connectDB()

// console.log(process.env.PORT)
app.get("/",(req,res)=>{
    res.send("welcome")
})


// APi Routes 
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api",subscriberRoute);

//Admin Routes
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);

console.log("Cart routes loaded:", !!cartRoutes);
app.listen(PORT , ()=>{
    console.log("Server Started..PORT 9000")
})