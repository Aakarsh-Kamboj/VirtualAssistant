import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext'

function Card({image}) {
  const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-17.5 h-35 lg:w-37.5 lg:h-62.5 bg-[#030326] border-2 border-blue-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage == image ? 'border-4 border-white shadow-2xl shadow-blue-950' : null}`} onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
        <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card