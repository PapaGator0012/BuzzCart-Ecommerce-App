const express = require("express")
const Checkout = require("../models/Checkout")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const Order = require("../models/Order")
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();
//@route POST /api/checkout
//@Desc Create a new checkout session
//@access private
router.post("/",protect,async(req,res)=>{
    const {checkoutItems , shippingAddress , paymentMethod , totalPrice} = req.body;

    //basic validation to check if there are any items in the chekout
    if(!checkoutItems || checkoutItems.length===0){
        return res.status(400).json({message:"No items in checkout"})
    }
    try {
        //create a new checkout session
        const newCheckout = await Checkout.create({
            user:req.user._id,
            checkoutItems:checkoutItems, 
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        })
        console.log(`Checkout Created for user:${req.user._id}`)
        res.status(201).json(newCheckout)
    } catch (error) {
        console.error("error creating checkout session",error)
        res.status(500).json({message:"Server error"})
    }
})

//@Route PUT /api/checkout/:id/pay
//@desc update Checkout to mark as padid after successful payment
//@acccess pricate
router.put("/:id/pay",protect,async(req,res)=>{
    const {paymentStatus , paymentDetails} = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id)
        if(!checkout){
            return res.status(404).json({message:"Checkout not Found"})
        }

        if(paymentStatus ==="paid"){
            checkout.isPaid=true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now()
            await checkout.save()

            res.status(200).json(checkout)
        }else{
            res.status(400).json({message:"Invalid Payment status"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

//@Route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert into an order after aoyment confirmation
//@access Private
router.post("/:id/finalize",protect,async(req,res)=>{
try {
    const checkout = await Checkout.findById(req.params.id)
    if(!checkout){
        return res.status(404).json({message:"Checkout not found"})
    }

    if(checkout.isPaid && !checkout.isFinalized){
        // if this is true crete the Final order based onthe checkout detilas
        const finalOrder = await Order.create({
            user:checkout.user,
            orderItems:checkout.checkoutItems,
            shippingAddress:checkout.shippingAddress,
            paymentMethod:checkout.paymentMethod,
            totalPrice:checkout.totalPrice,
            isPaid:true,
            paidAt:checkout.paidAt,
            isDelivered:false,
            paymentStatus:"paid",
            paymentDetails:checkout.paymentDetails,
        });
        // marl the checkout as finalzoed to prevent duplciate orders
        checkout.isFinalized=true;
        checkout.finalizedAt=Date.now();
        await checkout.save()
        //Delete the cart assiocaiated with the user
        await Cart.findOneAndDelete({user:checkout.user})
        res.status(201).json(finalOrder)
    }else if (checkout.isFinalized){
        res.status(400).json({message:"Checkout already finalized"})
    }else{
        res.status(400).json({message:"Checkout is not paid"})
    }
} catch (error) {
    console.error(error)
    res.status(500).json({message:"Server Error"})
}
})

module.exports = router;