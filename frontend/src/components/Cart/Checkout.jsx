import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {createCheckout} from "../../redux/slices/checkoutSlice" 
import axios from "axios";

const Checkout = () => {
const [CheckoutId , setCheckOutId]= useState(null)
     const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {cart,loading,error} = useSelector((state)=>state.cart)
    const {user} = useSelector((state)=>state.auth)
    const [shippingAddress, setShippingAddress] = useState({
        firstName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:'',
        country:"",
        phone:"",
    })
//ensure is not loaded befoer precedding
useEffect(()=>{
    if(!cart ||!cart.products || cart.products.length===0){
        navigate("/")
    }
},[cart , navigate])

    // function reposnible for sending req to backend and creating chout entry
    const handelCreateCheckout = async(e)=>{
        e.preventDefault();
        if(cart && cart.products.length>0){
            const res = await dispatch(createCheckout({
                checkoutItems:cart.products,
                shippingAddress,
                paymentMethod:"Paypal",
                totalPrice:cart.totalPrice,

            }))
            if(res.payload && res.payload._id){
                setCheckOutId(res.payload._id) // set checkout ID if checkout was successful

            }
        }
    }
    // const handelPaymentSuccess = async(details)=>{
    //   try {
    //     const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${CheckoutId}/pay`,{paymentStatus:"paid",paymentDetails:details},
    //         {
    //             headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`,},
    //         }
    //     )
       
    //         await handelFinalizeCheckout(CheckoutId)
    
    //   } catch (error) {
    //     console.error(error)
    //   }
       
    // }
    const handlePaymentSuccess = async (paymentMethod) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${CheckoutId}/pay`,
      { paymentStatus: "paid", paymentMethod: paymentMethod },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    await handleFinalizeCheckout(CheckoutId);
  } catch (error) {
    console.error("Payment failed", error);
  }
};
    // const handelFinalizeCheckout = async(CheckoutId)=>{
    //     try {
    //         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${CheckoutId}/finalize`,{
    //             headers:{
    //                 Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    //             },
    //         })
    //     navigate("/order-confirmation")
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
    const handleFinalizeCheckout = async (CheckoutId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${CheckoutId}/finalize`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    navigate("/order-confirmation");
  } catch (error) {
    console.error("Error finalizing checkout", error);
  }
};

    if(loading) return <p>Loading Cart...</p>
    if(error) return <p>Error: {error}</p>
    if(!cart || !cart.products || cart.products.length===0){
        return <p>Your cart is empty</p>
    }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
        {/* left section  */}
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl uppercase mb-6">Checkout</h2>
            <form action="" onSubmit={handelCreateCheckout}>
                <h3 className="text-lg mb-4">Contact Details</h3>
                <div className="mb-4">
                    <label htmlFor="" className='block text-gray-700'>Email:</label>
                    <input type="email"className='w-full p-2 border rounded'  value={user? user.email : ""}/>
                </div>
                <h3 className="text-lg mb-4">Devlivery</h3>
                <div className="mb-4 grid grid-cols-2 gap-4">
                   <div className="">
                    <label htmlFor="" className="block text-gray-700">First Name</label>
                    <input type="text" value={shippingAddress.firstName} onChange={(e)=> setShippingAddress({...shippingAddress,firstName:e.target.value})} className='w-full p-2 border rounded'  required/>
                   </div>
                   <div className="">
                    <label htmlFor="" className="block text-gray-700">Last Name</label>
                    <input type="text" value={shippingAddress.lastName} onChange={(e)=> setShippingAddress({...shippingAddress,lastName:e.target.value})} className='w-full p-2 border rounded'  required/>
                   </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block text-gray-700">Address</label>
                    <input type="text" className='w-full p-2 border rounded' value={shippingAddress.address}  onChange={(e)=>setShippingAddress({...shippingAddress,address:e.target.value,})} required/>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="">
                    <label htmlFor="" className="block text-gray-700">City</label>
                    <input type="text" value={shippingAddress.city} onChange={(e)=> setShippingAddress({...shippingAddress,city:e.target.value})} className='w-full p-2 border rounded'  required/>
                   </div>
                   <div className="">
                    <label htmlFor="" className="block text-gray-700">Postal Code</label>
                    <input type="text" value={shippingAddress.postalCode} onChange={(e)=> setShippingAddress({...shippingAddress,postalCode:e.target.value})} className='w-full p-2 border rounded'  required/>
                   </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block text-gray-700">Country</label>
                    <input type="text" className='w-full p-2 border rounded' value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block text-gray-700">Phone</label>
                    <input type="text" className='w-full p-2 border rounded' value={shippingAddress.phone}  onChange={(e)=>setShippingAddress({...shippingAddress,phone:e.target.value,})} required/>
                </div>

                <div className="mt-6">
  {!CheckoutId ? (
    <button type="submit" className="w-full bg-black text-white py-3 rounded">
      Continue to Payment
    </button>
  ) : (
    <div>
      <h3 className="text-lg mb-4">Choose Payment Method</h3>
      <button 
        className="w-full bg-blue-500 text-white py-3 rounded mb-4"
        onClick={() => handlePaymentSuccess("Credit Payment")}
      >
        Proceed with Credit
      </button>
      <button
        className="w-full bg-green-500 text-white py-3 rounded"
        onClick={() => handlePaymentSuccess("Paid")}
      >
        I Have Paid
      </button>
    </div>
  )}
</div>
            </form>
        </div>
        {/* Right section  */}
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg mb-4">Order Summary</h3>
            <div className="border-t py-4 mb-4">
                {cart.products.map((product , index)=>(
                    <div className="flex items-start justify-between py-2 border-b" key={index}>
                        <div className="flex items-start">
                            <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                            <div className="">
                                <h3 className="text-md">{product.name}</h3>
                                <p className="text-gray-500">Size:{product.size}</p>
                                <p className="text-gray-500">Color:{product.color}</p>
                            </div>
                            
                        </div>
                        <p className="text-xl">Price : ${product.price?.toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center text-lg mb-4">
                <p>Subtotal</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center text-lg">
                <p>Shipping</p>
                <p>Free</p>
            </div>
            <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                <p>Total</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
            </div>
        </div>
    </div>
  );
};

export default Checkout
