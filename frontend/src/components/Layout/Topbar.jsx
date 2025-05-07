import React from 'react'
import {TbBrandMeta } from "react-icons/tb"
import {IoLogoInstagram } from "react-icons/io"
import {RiTwitterXLine } from "react-icons/ri"
const Topbar = () => {
  return (
    <div className="bg-[var(--color-rabbit-red)] text-white">
        <div className="container mx-auto flex justify-between py-3">
            <div className='hidden md:flex item-center space-x-4' >
                <a href="#" className="hover:text-gray-300"> 
                    <TbBrandMeta className="h-5 w-5"/>
                    </a>
                <a href="#" className="hover:text-gray-300"> 
                    <IoLogoInstagram className="h-5 w-5"/>
                    </a>
                <a href="#" className="hover:text-gray-300"> 
                    <RiTwitterXLine className="h-5 w-5"/>
                    </a>
            </div>

            <div className="text-sm text-center flex-grow">
                <span>We ship worldwide - Fast and Reliable Shipping!</span>
            </div>
            <div className="text-sm hidden md:block">
                <a href='+92 3339271017' className='hover:text-gray-300'> +92 (453) 927-1347</a>
            </div>
        </div>
      
    </div>
  )
}

export default Topbar;
