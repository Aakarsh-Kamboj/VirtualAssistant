import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    
    const handleUpdateAssistant = async () => {
      setLoading(true)
      try {
        const formData = new FormData();
        formData.append("assistantName", assistantName);
        if (backendImage) {
          formData.append("assistantImage", backendImage);
        } else {
          formData.append("imageUrl", selectedImage);
        }
        const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials:true})
        setLoading(false)
        console.log(result.data);
        setUserData(result.data);
        navigate("/")
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 relative'>
      <MdKeyboardBackspace className='absolute top-7.5 left-7.5 text-white w-6.25 h-6.25 cursor-pointer' onClick={()=>navigate("/customize")}/>
        <h1 className='text-white text-[30px] text-center mb-10'>Enter your <span className='text-blue-200'>Assistant Name</span></h1>
        <input type="text" placeholder='eg. Friday' className='w-full  max-w-150 h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />

        {assistantName && <button className='min-w-75 h-15 mt-7.5 bg-white hover:bg-blue-700 text-black font-semibold rounded-full text-[20px] cursor-pointer' disabled={loading} onClick={()=>{
          handleUpdateAssistant()
          }}>{!loading ? "Finally Create Your Assistant" : "Loading.."}</button>}
    </div>
  )
}

export default Customize2
