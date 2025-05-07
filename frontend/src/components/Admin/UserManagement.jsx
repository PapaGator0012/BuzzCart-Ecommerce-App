import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser, deleteUser, updateUser, fetchUsers } from '../../redux/slices/adminSlice'
const UserManagement = () => {

    // const users = [
    //     {
    //         _id:121,
    //         name:"Syed Hassam Jan",
    //         email:"hassamjan0012@gmail.com",
    //         role:"admin",
    //     },
    // ]

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user} = useSelector((state)=>state.auth)
    const {users , loading , error } = useSelector((state)=>state.admin);

    useEffect(()=>{
        if(user && user.role !=="admin"){
            navigate("/")
        }
    },[user,navigate])

    useEffect(()=>{
        if(user && user.role==="admin"){
            dispatch(fetchUsers())

        }
    },[dispatch ,user])


    const [formData , setFormData] = useState({
        name:"",
        email:"",
        password:"",
        role:"customer",
    })


    const handelChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value}) // { email: "hello@gmail.com" }
    }

    const handelSubmit = (e)=>{
        e.preventDefault();
        dispatch(addUser(formData))
        // reset form afta submititon
        // console.log(formData)
        setFormData({
            name:"",
            email:"",
            password:"",
            role:"customer",
        })
    }
const handelDeleteUser = (userId)=>{
    if(window.confirm("Are you sure you want to delete this user?")){
        dispatch(deleteUser(userId))
        // console.log("deleting user with ID", userId)
    }
}
    const handelRoleChange = (userId , newRole) =>{
        dispatch(updateUser({id:userId,role:newRole}))
        // console.log({id:userId , role : newRole})
    }
  return (
<div className="max-w-7xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">User Management</h2>
    {loading && <p>Loading..</p>}
    {error && <p>error..{error}</p>}
    {/* Add New User form  */}
    <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Add new user</h3>

        <form onSubmit={handelSubmit}>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700">Name</label>
                <input type="text" name='name' value={formData.name} onChange={handelChange}
                className='w-full p-2 border rounded' required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700">Email</label>
                <input type="email" name='email' value={formData.email} onChange={handelChange}
                className='w-full p-2 border rounded' required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700">Password</label>
                <input type="password" name='password' value={formData.password} onChange={handelChange}
                className='w-full p-2 border rounded' required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-gray-700">Role</label>
                <select  name='role' value={formData.role} onChange={handelChange}
                className='w-full p-2 border rounded' required>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Add user</button>
        </form>
    </div>
    {/* // User list mangement  */}
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user)=>(
                    <tr key={user._id} className='border-b hover:bg-gray-50'>
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                            {user.name}
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                            <select value={user.role} onChange={(e)=> handelRoleChange(user._id , e.target.value)} className='p-2 border rounded'>
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </td>
                        <td className="p-4">
                            <button onClick={()=> handelDeleteUser(user._id)} className='bg-red-500 text-white px-4 rounded hover:bg-red-600'>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>



        
  )
}

export default UserManagement