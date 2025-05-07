const express = require("express")
const User = require("../models/user")
const {protect ,admin} = require("../middleware/authMiddleware")
const router = express.Router()


//@router GET .api/admin/users
//@desc get all users [admin only reqiest]
//@access Private Admin

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})


//add new users
//@route POST /a[i/admin/users
//@desc add aa new user
//@access Private admin
router.post("/",protect,admin,async(req,res)=>{
   const {name ,email,password,role }= req.body;
   try {
    // check if ther is already a user wiht the same emiail 
    let user = await User.findOne({email})
    if(user){
        return res.status(400).json({message:"user already exists"})
    }
    user = new User({
        name,
        email,
        password,
        role:role || "customer",
    });
    await user.save()
    res.status(201).json({message:"User Creted successfuly",user })
   } catch (error) {
    console.error(error)
    res.status(500).json({message:"Server error"})
   }
})


//update user details
//@route PUT / api/admin/users/:id
//@desc Update usr infomroafation (admin only)
//@access admin private

router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})

//@route DELETE /api/admin/users/"id
// @desc delete a user"
//access Private admin
router.delete("/:id",protect,admin,async(req,res)=>{

    try {
        const user = await User.findById(req.params.id)
        if(user){
            await user.deleteOne()
            res.status(200).json({message:"User deleted Successfuly"})
        }else{
            return res.status(404).json({message:"User not found"})
        }
     
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

module.exports = router