const express = require("express");
const Product = require("../models/Product")
const {protect , admin} = require("../middleware/authMiddleware")


const router = express.Router();

//@route POST /api/products
//@desc Create  a new product
//@access Private/ADmin

router.post("/",protect,admin,async(req,res)=>{
    try {
        const {name , description , price , discountPrice, countInStock , category, brand , sizes ,colors, collections, material , gender , images,isFeatures, isPublished,tags,dimensions,weight,sku} = req.body;
        // carete new product intance 
        const product = new Product({name , description , price , discountPrice, countInStock , category, brand , sizes ,colors, collections, material , gender , images,isFeatures, isPublished,tags,dimensions,weight,sku,user:req.user._id,});
        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error(error)
        res.status(500).send("server error")
    }
})

// updating the product 
//@rout PUT api/products/:id
//@desc Update adn eidting product by its id
//@access Private/Admin

router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const {name , description , price , discountPrice, countInStock , category, brand , sizes ,colors, collections, material , gender , images,isFeatured, isPublished,tags,dimensions,weight,sku} = req.body;
            // find product in the databse by ID
            const product = await Product.findById(req.params.id);
            if(product){
                //update product fields
                product.name=name || product.name;
                product.description=description || product.description;
                product.price=price || product.price;
                product.discountPrice=discountPrice || product.discountPrice;
                product.countInStock=countInStock || product.countInStock;
                product.category=category || product.category;
                product.brand=brand || product.brand;
                product.sizes=sizes || product.sizes;
                product.colors=colors || product.colors;
                product.collections=collections || product.collections;
                product.material=material || product.material;
                product.gender=gender || product.gender;
                product.images=images || product.images;
                product.isFeatured=isFeatured!== undefined ? isFeatured :product.isFeatured;
                product.isPublished=isPublished!== undefined ? isPublished :product.isPublished;
                product.tags=tags || product.tags;
                product.dimensions=dimensions || product.dimensions;
                product.weight=weight || product.weight;
                product.sku=sku||product.sku;

                // save the updated product
                const updatedProduct = await product.save();
                res.json(updatedProduct);
            }else{
                // if product not found
                res.status(404).json({message:"Prouct not found"})
            }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})
//@route DELETE /api/products/:id
//@desc Delete a prdut by its id from DB
//@acess Private/Admon

router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        // find the product  by id
        const product = await Product.findById(req.params.id)
        if(product){
            // remove from the database
            await product.deleteOne();
            res.json({message:"Product removed"})
        }else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server ERROR!")
    }
})

//@route GEt / api/products
//@desc Get all proutucts wit hoptional query filter
//@acces public

router.get("/",async(req,res)=>{
    try {
        const {collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit}=req.query;

            let query ={};
            // filtering logic based on query parameters
            if(collection && collection.toLocaleLowerCase()!=="all"){
                query.collections=collection;
            }
            if(category && category.toLocaleLowerCase()!=="all"){
                query.category=category;
            }
            if(material){
                query.material={$in: material.split(",")};
            }
            if(brand){
                query.brand={$in: brand.split(",")};
            }
            if(size){
                query.sizes={$in: size.split(",")};
            }
            if(color){
                query.colors = {$in: [color]}
                // query.colors = { $in: color.split(",") }
                // query.colors = { $in: [color] };
            }
            if(gender){
                query.gender = gender
            }
            if(minPrice || maxPrice){
                query.price={};
                if(minPrice) query.price.$gte=Number(minPrice)
                if(maxPrice) query.price.$lte=Number(maxPrice)
            }
        if(search){
            query.$or = [
                {name:{$regex:search , $options:"i"}},
                {description:{$regex:search , $options:"i"}},
            ]
        }

        //sorting Logic
           let sort={}
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort={price:1};
                    break;
                case "priceDesc":
                    sort={price:-1};
                    break;
                case "popularity":
                    sort = {rating:-1};
                    break;
                default:
                    break;
            }
        }

        //Fetch Products from database
        let products = await Product.find(query).sort(sort).limit(Number(limit)||0);
        res.json(products)

    } catch (error) {
        console.error(error);
        res.status(500).send("server error")
    }
})
//@route GET / api/procucts/best-seller
//@desc Retrieve the product with highest rating 
//@access Public

router.get("/best-seller",async(req,res)=>{
    try {
        const bestseller = await Product.findOne().sort({rating:-1})
        if(bestseller){
            res.json(bestseller)
        }else{
            res.status(404).json({message:"NO best seller found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//@route Get .api.pridts/new-arrivals
//@desc Retureve latest prodcuts  - Creteion data
//@access Public

router.get("/new-arrivals",async(req,res)=>{
    try {
        // fetch latest 8 products form databse
        const newArrivals = await Product.find().sort({createdAt:-1}).limit(8)
        res.json(newArrivals)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})


//@route GET /api/products/id
//@desc Get a single product by its id
// @access Public

router.get("/:id",async(req,res)=>{
   try{
        const product = await Product.findById(req.params.id)
        if(product){
            res.json(product)
        }else{
            res.status(404).json({message:"Prouct not found"});
        }
   }catch(error){
          console.error(error)
          res.status(500).send("Server Error")
   }
})


//@route Get/api/products/similar/:id
//@desc Retrueve similar products bsed on the current procuts gender and category
//@acccess Public

router.get("/similar/:id",async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        const similarProucts = await Product.find({
            _id:{$ne:id}, // excluse the current prodct id
            gender:product.gender,
            category:product.category,
        }).limit(4)

        res.json(similarProucts)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})


module.exports = router;