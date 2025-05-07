import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSidebar = () => {
    const [searchParams , setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters , setFilters] = useState({
        category:"",
        gender:"",
        color:"",
        size:[],
        material:[],
        brand:[],
        minPrice:0,
        maxPrice:100,
    })

    const[priceRange , setPriceRange] = useState([0 ,100])
    const categories =["Top Wear" , "Bottom Wear"];
    const colors = [
        "Red",
        "Blue",
        "BLack",
        "Green",
        "Yellow",
        "Gray",
        "yellow",
        "Purple",
        "White",
        "Pink",
        "Beige",
        "Navy"
    ];

    const sizes = ["XS","S","M","L","XL","XXL"];

    const materials = [
        "Cotton",
        "Wool",
        "Denim",
        "Polyster",
        "Silk",
        "Linen",
        "Viscose",
        "Fleece",
    ];


    const brands =[
        "Urban Threads",
        "Modern Fit",
        "Street Style",
        "Beach Breeze",
        "Fashionista",
        "ChicStyle",
    ];
    const genders = ["Men","Women"];

    useEffect(()=>{
        const params = Object.fromEntries([...searchParams])
        setFilters({
            category:params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size? params.size.split(","): [],
            material: params.material? params.material.split(","): [],
            brand: params.brand? params.brand.split(","): [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        })
        setPriceRange([0,params.maxPrice || 100])
    },[searchParams])
  

    const handelFilterChange = (e)=>{
        const {name,value,checked,type} = e.target;
        // console.log({name,value,type})
        let newFilters ={...filters};
        if(type==="checkbox"){
            if(checked){
                newFilters[name] = [...(newFilters[name] || []), value]; 
            }else{
                newFilters[name] = newFilters[name].filter((item)=>item!==value);
            }
            // for type other than checkbox simpyl assign value to da key
        } else{
            newFilters[name]=value;
        }
        setFilters(newFilters)
        updateURLParams(newFilters)
        console.log(newFilters);
    }

    const updateURLParams = (newFilters)=>{
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key)=>{
            if(Array.isArray(newFilters[key]) && newFilters[key].length > 0){
                params.append(key,newFilters[key].join(","));
            } else if ( newFilters[key]){
                params.append(key,newFilters[key]);
            }
        })
        setSearchParams(params)
        navigate(`?${params.toString()}`);
    }

    const handelPriceChange=(e)=>{
        const newPrice = e.target.value;
        setPriceRange([0,newPrice])
        const newFilters={...filters,minPrice:0,maxPrice:newPrice};
        updateURLParams(newFilters)
    }
  return (
    <div className='p-4'>
       <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

       {/* category filter  */}

       <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category)=>(
            <div key={category} className="flex items-center mb-1">
              <input onChange={handelFilterChange} value={category} type="radio" name="category" checked={filters.category===category} className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
              <span className="text-gray-700">{category}</span>
            </div>
        ))}
       </div>
      {/* Gender filter  */}
       <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender)=>(
            <div key={gender} className="flex items-center mb-1">
              <input  onChange={handelFilterChange} value={gender} type="radio" name="gender" checked={filters.gender===gender} className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
              <span className="text-gray-700">{gender}</span>
            </div>
        ))}
       </div>
       {/* Color Section  */}
       <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
            Color
        </label>
        <div className="flex flex-wrap gap-2">
            {colors.map((color)=>(
                <button value={color}  onClick={handelFilterChange} key={color} name='color' className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-105 ${filters.color===color? "ring-2 ring-blue-500":""}`} style={{backgroundColor:color.toLowerCase()}}> </button>
            ))}
        </div>
       </div>
       {/* Size filter  */}
       <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size)=>(
            <div className="flex items-center mb-1" key={size}>
                <input onChange={handelFilterChange} value={size} type="checkbox" name='size'checked={filters.size.includes(size)}  className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
                <span className="text-gray-700">{size}</span>
            </div>
        ))}
       </div>
         {/* material filter  */}
         <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material)=>(
            <div className="flex items-center mb-1" key={material}>
                <input value={material} checked={filters.material.includes(material)} onChange={handelFilterChange} type="checkbox" name='material' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
                <span className="text-gray-700">{material}</span>
            </div>
        ))}
       </div>
         {/* brands filter  */}
         <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Brands</label>
        {brands.map((brand)=>(
            <div className="flex items-center mb-1" key={brand}>
                <input value={brand} checked={filters.brand.includes(brand)} onChange={handelFilterChange} type="checkbox" name='brand' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
                <span className="text-gray-700">{brand}</span>
            </div>
        ))}
       </div>

        {/* price range filter  */}
        <div className="mb-8">
            <label htmlFor="" className="block text-gray-600 font-medium mb-2">Price range</label>
            <input type="range" value={priceRange[1]} onChange={handelPriceChange} name='priceRange' min={0} max={100} className='w-full h-full bg-gray-300 rounded-lg appearance-none cursor-pointer' />
            <div className="flex justify-between text-gray-600 mt-2">
                <span>$0</span>
                <span>${priceRange[1]}</span>
            </div>
        </div> 
    </div>
  )
}

export default FilterSidebar
