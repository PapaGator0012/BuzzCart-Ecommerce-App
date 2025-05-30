import {createSlice , createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

//helper function to loadd cart from laocal storage
const loadCartFromStorage =()=>{
    const storedCart = localStorage.getItem("cart")
    return storedCart ? JSON.parse(storedCart) : {products:[]};
}

//helper functuin to save cart to localStorage
const saveCartToStorage = (cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart))
}

//fetch cart for a user or guest

export const fetchCart = createAsyncThunk("cart/fetchCart",async({userId,guestId},{rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
            params:{userId,guestId},
        })
        return response.data;
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response?.data ||"error fetching cart")
    }
})

// Add an item to the cart for a user of Guest
export const addToCart=createAsyncThunk("cart/addToCart",async({productId,quantity,size,color,guestId,userId},{rejectWithValue})=>{
    try {
        //post req to add item to cart 
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
            productId,
            quantity,
            size,
            color,
            guestId,
            userId,
        })
        return response.data;
    } catch (error) {
        console.error(error); 
        return rejectWithValue(error.response.data)
    }
})

//update the quanity of an item in the cart
// export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity",async({productId,quantity,guestId,userId,size,color},{rejectWithValue})=>{
//     try {
//         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
//             productId,
//             quantity,
//             guestId,
//             userId,
//             size,
//             color,
//         })
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response?.data)
//     }
// })
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async({productId, quantity, guestId, userId, size, color}, {rejectWithValue}) => {
        try {
            // Using axios with the correct configuration for PUT requests
            const response = await axios({
                method: "PUT",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: {
                    productId,
                    quantity,
                    guestId,
                    userId,
                    size,
                    color
                }
            });
            
            return response.data;
        } catch (error) {
            console.error("Update cart error:", error);
            return rejectWithValue(error.response?.data || "Failed to update cart");
        }
    }
);
//remove and item from the cart
// export const removeFromCart=createAsyncThunk("cart/removeFromCart",async({productId,guestId,userId,size,color},{rejectWithValue})=>{
//     try {
//         // const response = await axios({
//         //     method:"DELETE",
//         //     url:`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
//         //     data:{productId,guestId,userId,size,color},
//         // })
//         const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
//             params: {productId, guestId, userId, size, color}
//         });
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data)
//     }
// })
//-------------------------------------------------------------
// export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({productId, guestId, userId, size, color}, {rejectWithValue}) => {
//     try {
//         const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
//             data: { productId, guestId, userId, size, color }  // Change to 'data' instead of 'params'
//         });
//         console.log("Remove from cart response:", response.data); 
//         return response.data;
//     } catch (error) {
//         console.log("Catch Error in cartSlice",error)
//         return rejectWithValue(error.response?.data);
//     }
// });
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart", 
    async({productId, guestId, userId, size, color}, {rejectWithValue}) => {
        try {
            // Using axios with the correct configuration for DELETE requests
            const response = await axios({
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: {
                    productId,
                    guestId,
                    userId,
                    size,
                    color
                }
            });
            
            console.log("Remove from cart response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Remove from cart error:", error);
            return rejectWithValue(error.response?.data || "Failed to remove item");
        }
    }
);
//merge guest cart into a user cart
export const mergeCart = createAsyncThunk("cart/mergeCart",async({guestId,user},{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,{guestId,user},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`,
            },
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// create the cart slcie to manage the cart related stufff
const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart:loadCartFromStorage(),
        loading:false,
        error:null,
    },
    reducers:{
        clearCart:(state)=>{
            state.cart = {products:[]}
            localStorage.removeItem("cart")
        },
    },
    extraReducers:(builder) =>{
        builder
        .addCase(fetchCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload)
        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message || "Failed to fetch cart";
        })
        .addCase(addToCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload)
        })
        .addCase(addToCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to add to cart"
        })
        .addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload)
        })
        .addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to update item quantity"
        })
        .addCase(removeFromCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(removeFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload)
        })
        .addCase(removeFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to remove item"
        })
        .addCase(mergeCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(mergeCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload)
        })
        .addCase(mergeCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to merge cart"
        })
    },
});

export const {clearCart}=cartSlice.actions;
export default cartSlice.reducer;