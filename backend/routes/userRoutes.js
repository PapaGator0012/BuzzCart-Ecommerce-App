const express = require("express");
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {protect} = require("../middleware/authMiddleware")
const router = express.Router();

//@route POST /api/users/register
// @desc register a new user
//@access Public

router.post("/register",async(req,res)=>{
    const {name , email , password } = req.body;

    try{
        //registeration logic
        // res.send({name,email,password});
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message:"User Already Exists"});

        user = new User({name , email , password});
        await user.save();
        // res.status(201).json({
        //     user:{
        //         _id:user._id,
        //         name:user.name,
        //         email:user.email,
        //         role:user.role,
        //     },
        // });
        // create JWT payload
        const payload = {user:{id:user._id,role:user.role}};
        // sign and return the token along with user data 
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
            if(err) throw err;

            //send user and token in repsonse
            res.status(201).json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                },
                token,
            })
        })

    } catch(error){
        console.log(error)
        res.status(500).send("Server Error");
    } 
})

//@route POST /api/users/login
//@desc Authenticate user
//@access Public

router.post("/login",async(req,res)=>{
    const{email , password}=  req.body;
    try{
        // find the user by email
        let user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"});
         const isMatch = await bcrypt.compare(password,user.password)
        // const isMatch = await User.findOne({password})
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials "})
        

 // create JWT payload
 const payload = {user:{id:user._id,role:user.role}};
            //sign and return the token along with user data
            jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
                if(err) throw err;
    
                //send user and token in repsonse
                res.json({
                    user:{
                        _id:user._id,
                        name:user.name,
                        email:user.email,
                        role:user.role,
                    },
                    token,
                })
            })
    }catch(error){ console.error(error); res.status(500).send("Server Error")}
})

//@route GET /api/users/profile
//@Desc Get logged-in users profile (protected route)
//@access Private
router.get("/profile",protect,async(req,res)=>{
    res.json(req.user);
    console.log("check")
})
module.exports = router;

