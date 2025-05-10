const express = require("express")
const Cart = require("../models/Cart")
const User = require("../models/user")
const Product= require("../models/Product")
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();


//helper function to get a cart by user Id or guest Id
const getCart = async(userId,guestId)=>{
    console.log("DEBUG: getCart called with:");
    console.log("  userId:", userId);
    console.log("  guestId:", guestId);
    
    if(userId){
        return await Cart.findOne({user:userId});
    }else if (guestId){
        return await Cart.findOne({guestId});
    }
    return null;
}

// @route POST /api/cart
//@desc Add  product to the cart for a guest or loged in user
//@access Public
router.post("/",async(req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        const product = await Product.findById(productId)
        if(!product) return res.status(404).json({message:"Product not found"})

            //Determine user is loged in or guest

            let cart = await getCart(userId,guestId);

            // if the cart exists , update it
            if(cart){
                const productIndex= cart.products.findIndex((p)=>
                p.productId.toString()===productId &&
                p.size ===size &&
                p.color=== color
                );

                //variant of the produt present in the cart
                if(productIndex>-1){
                    // if the prod alredy exists then update the quantity
                    cart.products[productIndex].quantity+=quantity;
                }else{
                    //add new product cuz product not prsnt inthte cart
                    cart.products.push({
                        productId,
                        name:product.name,
                        image:product.images[0].url,
                        price:product.price,
                        size,
                        color,
                        quantity,
                    });
                }

                //Recalculae the total price
                cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price * item.quantity,0)
                await cart.save();
                return res.status(200).json(cart)
            }
            else{
                //Create a new cart for the guest or user
                const newCart = await Cart.create({
                    user:userId? userId:undefined,
                    guestId:guestId?guestId:"guest_"+new Date().getTime(),
                    products:[
                        {
                            productId,
                            name:product.name,
                            image:product.images[0].url,
                            price:product.price,
                            size,
                            color,
                            quantity,
                        },
                    ],
                    totalPrice:product.price*quantity,
                });
                return res.status(201).json(newCart)
            }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})


    }
})
//@route PUT /api/cart
//@desc Update prpduct quantity in hte cart for a guest or logein user
//@access Public

router.put("/",async(req,res)=>{
    const{productId , quantity,size,color,guestId,userId}=req.body
    try {
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message:"Cart not Found"})

            // const productIndex=cart.products.findIndex((p)=>p.productId.toString()===productId && p.size && p.color ===color)

            const productIndex = cart.products.findIndex(
                (p) =>
                  p.productId.toString() === productId &&
                  p.size === size &&
                  p.color === color
              );


            //if variance is found of this product then
            if(productIndex >-1){
                //update quantity
                if(quantity > 0){
                    cart.products[productIndex].quantity=quantity;
                }else{
                    cart.products.splice(productIndex,1);
                }
                cart.totalPrice = cart.products.reduce((acc,item)=>acc + item.price *item.quantity,0)
                await cart.save()
                return res.status(200).json(cart);
            
            }else{
                return res.status(404).json({message:"Product not found in cart"})
            }

    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Server Error"})
    }
})
//@route DELETE /api/cart
//@desc Remove product form the cart
//@access PUBLIC

router.delete("/",async(req,res)=>{
    const {productId,size,color,guestId,userId}=req.body; 
    try {
        let cart = await getCart(userId,guestId)
        console.log("Cart:", cart);
        if(!cart) return res.status(404).json({message:"Cart not found"})
            const productIndex = cart.products.findIndex((p)=>
        p.productId.toString()===productId && p.size===size && p.color===color
            )

            if(productIndex>-1){
                cart.products.splice(productIndex,1)
                cart.totalPrice= cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
                await cart.save()
                return res.status(200).json(cart)
            }else{
                return res.status(404).json({message:"PRoduct not found in the cart"})
            }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})


//@route GET/api/cart
//@desc  Get logged in users or guest users cart
//@access Public
router.get("/",async(req,res)=>{
    const{userId,guestId}=req.query;
    try {
        const cart = await getCart(userId,guestId);
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({message:"Cart not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})


//@route POST /apicart/merge
//@desc  Mere guest cart nto user cart on login
//@acces Pricate
router.post("/merge",protect,async(req,res)=>{
    const {guestId} = req.body;
    try {
        // find the guest and user cart 
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({user: req.user._id});
       if(guestCart){
        if(guestCart.products.length===0){
            return res.status(400).json({message:"Guest Cart is empty"});

        }
        if(userCart){
            //Merge guest Cart into user cart
            guestCart.products.forEach((guestItem)=>{
                const productIndex= userCart.products.findIndex((item)=>
                item.productId.toString()===guestItem.productId.toString()&& item.size===guestItem.size && item.color===guestItem.color
                );

                if(productIndex>-1){
                    // if the item exists in the user cart , update the quantity
                    userCart.products[productIndex].quantity+= guestItem.quantity;
                }else{
                    //Otherwise , add the guest item to the cart
                    userCart.products.push(guestItem)
                }
            });
            userCart.totalPrice = userCart.products.reduceRight((acc,item)=>acc+item.price * item.quantity,0)
            await userCart.save()
            // remove the guest cart after merging
            try {
                await Cart.findOneAndDelete({guestId})
            } catch (error) {
                console.error(error)
                // res.status(500).json({message:"Server Error"})
            }
            res.status(200).json(userCart)

        }else{
            // if the user has no existing cart then asign the guest cart to the user
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save()
            res.status(200).json(guestCart)
        }
       }else{
        if(userCart){
            //guest cart already merged then reutrn user cart
            return res.status(200).json(userCart)
        }
        res.status(404).json({message:"Guest Cart not found"})
       }
    } catch (error) {
      console.error(error)
      res.status(500).json({message:"Server Error"})
    }
})
module.exports=router;
