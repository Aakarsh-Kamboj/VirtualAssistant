import React, { useContext } from 'react'
import Card from '../components/Card'
import image1 from '../assets/aiAssistant1.jpg'
import image2 from '../assets/aiAssistant2.jpg'
import image3 from '../assets/aiAssistant3.jpg'
import image4 from '../assets/aiAssistant4.jpg'
import image5 from '../assets/aiAssistant5.jpg'
import image6 from '../assets/ankita.jpeg'
import image7 from '../assets/aiAssistant8.jpeg'
import { BiImageAdd } from "react-icons/bi";
import { useState } from 'react'
import { useRef } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
    const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
    const navigate = useNavigate()
    const inputImage = useRef()
    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5'>
      <MdKeyboardBackspace className='absolute top-7.5 left-7.5 text-white w-6.25 h-6.25 cursor-pointer' onClick={()=>{
        console.log(userData.assistantName);
        console.log(userData.assistantImage);
        navigate("/")
        console.log("Hi");
        console.log(userData.assistantName);
        console.log(userData.assistantImage);
      }}/>
        <h1 className='text-white text-[30px] text-center mb-10'>Select your <span className='text-blue-200'>Assistant Image</span></h1>
        <div className='w-full max-w-225 flex justify-center items-center flex-wrap gap-3.75'>
        <Card image={image1}/>
        <Card image={image3}/>
        <Card image={image6}/>
        <Card image={image7}/>
        <div className={`w-17.5 h-35 lg:w-37.5 lg:h-62.5 bg-[#030326] border-2 border-blue-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage == "input" ? 'border-4 border-white shadow-2xl shadow-blue-950' : null}`} onClick={()=>{
          inputImage.current.click()
          setSelectedImage("input")
        }}>
            {!frontendImage && <BiImageAdd className='text-white w-6.25 h-6.25'/>}
            {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
            
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
        </div>
        {selectedImage && <button className='min-w-37.5 h-15 mt-7.5 bg-white hover:bg-blue-700 text-black font-semibold rounded-full text-[20px] cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>}
        
    </div>
  )
}

export default Customize
