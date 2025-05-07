const express = require("express")
const router = express.Router()
const Subscriber = require("../models/Subscriber")

//@route POSt api/subscribe
//@desc handel newsletter subs
//@acces public
router.post("/subscribe",async(req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message:"Email is required"})
    }
    try {
        //chck if the email is already subscrubed
        let subscriber = await Subscriber.findOne({email})
        if(subscriber){
            return res.status(400).json({message:"email is already subscribred"})
        }
        //if not subed then create new suber
        subscriber = new Subscriber({email})
        await subscriber.save()
        res.status(201).json({message:"Successfuly subed to the news letter"})
    } catch (error) {
        console.error(500).json({message:"Server error"})
    }
})

module.exports = router