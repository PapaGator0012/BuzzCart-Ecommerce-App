// import React from 'react'
// import {Link} from 'react-router-dom'
// import {HiOutlineUser,HiOutlineShoppingBag , HiBars3BottomRight} from 'react-icons/hi2'
// import SearchBar from './SearchBar'
// import CartDrawer from '../Layout/CartDrawer'
// import { useState } from 'react'
// import { IoMdClose } from 'react-icons/io'
// import { useSelector } from 'react-redux'
// const Navbar = () => {
//     const [drawerOpen , setDrawerOpen] = useState(false);
//     const [navDrawerOpen ,setNavDrawerOpen] = useState(false);
//     const {cart} = useSelector((state)=>state.cart)

//     const cartItemCount = cart?.products?.reduce((total,product)=>total+product.quantity,0) || 0;

//     const toggleNavDrawer = () =>{
//     setNavDrawerOpen(!navDrawerOpen);
//     }
//     const toggleCartDrawer = () =>{
//         setDrawerOpen(!drawerOpen);
//     }
//   return (
//    <>
//    <nav className='container mx-auto flex item-center justify-between py-4 px-6'>
//     {/* logo loeft */}
//     <div >
//         <Link to="/" className='text-2xl font-medium'>Rabbit</Link>
//     </div>
//     {/* central navigation links  */}
//     <div className='hidden md:flex space-x-6'>
//         <Link to="/collections/all?gender=Men" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Men</Link>
//         <Link to="/collections/all?gender=Women" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Women</Link>
//         <Link to="/collections/all?category=Top Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Top Wear</Link>
//         <Link to="/collections/all?category=Bottom Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Bottom Wear</Link>
//     </div>
//     {/* right icons  */}
//     <div className="flex item-center space-x-4">
//         <Link to="/admin" className='block bg-black px-3 py-1 rounded text-sm text-white text-center'>Admin</Link>
//         <Link to="/profile" className='hover:text-black'><HiOutlineUser className='h-6 w-6 text-gray-700'></HiOutlineUser></Link>
//         <button onClick={toggleCartDrawer} className='relative hover:text-black'> 
//             <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
//             {cartItemCount>0 &&(
//  <span className='absolute -top-1 bg-[var(--color-rabbit-red)] text-white text-xs rounded-full px-2 py-0.5'>{cartItemCount}</span>
//             )}
           
//             </button>
//         {/* search  */}
//         <div className="overflow-hidden">
//         <SearchBar></SearchBar>
//         </div>
//         <button onClick={toggleNavDrawer} className='md:hidden'>
//             <HiBars3BottomRight className='h-6 w-6 text-gray-700'></HiBars3BottomRight>
//         </button>
//     </div>
//    </nav>
//    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}></CartDrawer>

//    {/* Mobile Navigation  */}
//    <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
//     <div className="flex justify-end p-4">
//         <button>
//             <IoMdClose onClick={toggleNavDrawer} className='h-6 w-6 text-gray-600'></IoMdClose>
//         </button>
//     </div>
//     <div className="p-4">
//         <h2 className='text-xl font-semibold mb-4'></h2>
//         <nav className='space-y-4'>
//             <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Men</Link>
//             <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Women</Link>
//             <Link to="/collections/all?category=Top Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Top Wear</Link>
//             <Link to="/collections/all?category=Bottom Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Bottom Wear</Link>
//         </nav>
//     </div>
//    </div>
//    </>
//   )
// }

// export default Navbar
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'


const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const { cart } = useSelector((state) => state.cart)
    const {user} = useSelector((state)=>state.auth)

    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    }
    
    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }
    
    return (
        <>
            <div className="w-full overflow-x-hidden">
                <nav className='max-w-screen-xl mx-auto flex items-center justify-between py-2 sm:py-4 px-2 sm:px-6'>
                    {/* logo left */}
                    <div>
                        <Link to="/" className='text-xl sm:text-2xl font-medium'>BuzzCart</Link>
                    </div>
                    
                    {/* central navigation links */}
                    <div className='hidden md:flex space-x-6'>
                        <Link to="/collections/all?gender=Men" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Men</Link>
                        <Link to="/collections/all?gender=Women" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Women</Link>
                        <Link to="/collections/all?category=Top Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Top Wear</Link>
                        <Link to="/collections/all?category=Bottom Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Bottom Wear</Link>
                    </div>
                    
                    {/* right icons */}
                    <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
                        {user && user.role==="admin" && (
                         <Link to="/admin" className='block bg-black px-2 py-1 rounded text-xs sm:text-sm text-white text-center'>Admin</Link>
                        )}
                        <Link to="/profile" className='hover:text-black'>
                            <HiOutlineUser className='h-5 w-5 sm:h-6 sm:w-6 text-gray-700' />
                        </Link>
                        <button onClick={toggleCartDrawer} className='relative hover:text-black'> 
                            <HiOutlineShoppingBag className='h-5 w-5 sm:h-6 sm:w-6 text-gray-700' />
                            {cartItemCount > 0 && (
                                <span className='absolute -top-1 -right-1 bg-[var(--color-rabbit-red)] text-white text-xs rounded-full px-1.5 py-px sm:px-2 sm:py-0.5'>{cartItemCount}</span>
                            )}
                        </button>
                        
                        {/* search */}
                        <div className="w-auto max-w-[100px] xs:max-w-[150px] sm:max-w-none">
                            <SearchBar />
                        </div>
                        
                        <button onClick={toggleNavDrawer} className='md:hidden'>
                            <HiBars3BottomRight className='h-5 w-5 sm:h-6 sm:w-6 text-gray-700' />
                        </button>
                    </div>
                </nav>
            </div>
            
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile Navigation */}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className='h-5 w-5 sm:h-6 sm:w-6 text-gray-600' />
                    </button>
                </div>
                <div className="p-4">
                    <h2 className='text-xl font-semibold mb-4'>Menu</h2>
                    <nav className='space-y-4'>
                        <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Men</Link>
                        <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Women</Link>
                        <Link to="/collections/all?category=Top Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Top Wear</Link>
                        <Link to="/collections/all?category=Bottom Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Bottom Wear</Link>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar