import React from 'react'
import bg from "../assets/bgImg.jpg"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from 'axios';

function SignIn() {
    const [showPassword,setShowPassword] = useState(false);
    const {serverUrl,userData,setUserData} = useContext(userDataContext);
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [loading,setLoading] = useState(false);
    const [password,setPassword] = useState("");
    const [err,setErr] = useState("");
    const handleSignIn = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signin`,{
                email, password
            }, {withCredentials:true})
            setUserData(result.data);
            setLoading(false);
            navigate("/")
        } catch (error) {
            console.log(error);
            setUserData(null);
            setLoading(false);
            setErr(error.response.data.message);
        }
    }
  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
      <form className='w-[90%] h-150 max-w-125 bg-[#e3d0d00a] backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-5 px-5' onSubmit={handleSignIn}>
        <h1 className='text-white text-[30px] font-semibold mb-7.5'>Sign In to <span className='text-blue-400'>Virtual Assisant</span></h1>
        <input type="email" placeholder='Enter your Email' className='w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <div className='w-full h-15 outline-none border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
            <input type={showPassword ? "text" : "password"} placeholder='Enter your Password' className='w-full h-full outline-none text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]' onChange={(e)=>setPassword(e.target.value)} value={password} />
            {!showPassword && <IoEye className='absolute cursor-pointer right-5 top-4.5 w-6.25 h-6.25 text-white' onClick={()=>setShowPassword(true)} />}
            {showPassword && <IoEyeOff className='absolute cursor-pointer right-5 top-4.5 w-6.25 h-6.25 text-white' onClick={()=>setShowPassword(false)} />}
        </div>
        {err.length > 0 && <p className='text-red-500 text-[16px]'>*{err}</p>}
        <button type='submit' className='min-w-37.5 h-15 mt-7.5 bg-white hover:bg-blue-700 text-black font-semibold rounded-full text-[20px] cursor-pointer' disabled={loading}>{loading?"Loading..":"Sign In"}</button>
        <p className='text-white text-[18px] cursor-pointer' onClick={()=>navigate("/signup")}>Want to register your account? <span className='text-blue-400'>Sign Up</span></p>
      </form>
    </div>
  )
}

export default SignIn
