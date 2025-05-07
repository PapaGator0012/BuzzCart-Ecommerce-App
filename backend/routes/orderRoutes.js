const express =require("express")
const Order = require("../models/Order")
const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

//@route GET /api/orders/my-orders
//@desc Get loged in users orders
// /@access PRIVATE 

router.get("/my-orders",protect,async(req,res)=>{
    try {
        // find orders for authenticated user
        const orders = await Order.find({user:req.user._id}).sort({createdAt:-1,})
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

//@route Get /api/orders/:id
//@desc get orders details by id
//@access Private

router.get("/:id",protect,async(req,res)=>{
    try {
        //attempt to find the order in the database

        const order = await Order.findById(req.params.id).populate("user","name email")
        if(!order){
            return res.status(404).json({message:"order not Found"})
        }

        //return the full order detals if dound
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

module.exports = router;