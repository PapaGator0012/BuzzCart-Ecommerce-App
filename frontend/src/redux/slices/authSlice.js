import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//retrieve user info and token from localstarogare if available
const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")): null;


//chec for an existing guest ID in the local storage 
const initialGuestId=localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId",initialGuestId)


// initital state for the auth slice
const initialState = {
    user:userFromStorage,
    guest:initialGuestId,
    loading:false,
    error:null,
};

//ASync thunk that will handel User login
export const loginUser = createAsyncThunk("auth/loginUser",async(userData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,userData)
        // if login works then save user info in local storage 
        localStorage.setItem("userInfo",JSON.stringify(response.data.user))
        localStorage.setItem("userToken",response.data.token)
        return response.data.user; // reutnr the user object form the response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



//ASync thunk that will handel User Registeration
export const registerUser = createAsyncThunk("auth/registerUser",async(userData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`,userData)
        // if login works then save user info in local storage 
        localStorage.setItem("userInfo",JSON.stringify(response.data.user))
        localStorage.setItem("userToken",response.data.token)
        return response.data.user; // reutnr the user object form the response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
});

//Slice 
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.guestId=`guest_${new Date().getTime()}` // reset guest on logout
            //clean up local storage
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId",state.guestId); // set new guest ID in localStorage

        },
        // add an action that genrate a new guestID
        generateNewGuestId:(state)=>{
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId",state.guestId)
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state ,action)=>{
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
        .addCase(registerUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registerUser.fulfilled,(state ,action)=>{
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
    }
})

export const {logout , generateNewGuestId } = authSlice.actions;
export default authSlice.reducer; 