import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import aiImg from "../assets/assistant.gif"
import userImg from "../assets/user.gif"

function Home() {
  const {userData, setUserData, serverUrl, getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error);
      
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error)
      }
    }
  }
  };

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(()=>{
        startRecognition()
      },800);
    }
    synth.cancel();
    synth.speak(utterence);
    
  }

  const handleCommand = (data) => {
    const {type, userInput, response} = data
    speak(response)

    if (type === 'google-search') {
      const query  = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === 'instagram-open') {
      window.open(`https://www.instagram.com`, '_blank');
    }

    if (type === 'weather-show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search') {
      const query  = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if (type === 'youtube-play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`,'_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition()

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition

    let isMounted = true; // flag to avoid setState on unmounted component

    // Start recognition after 1 second delay only if component still mounted
    const startTimeout = setTimeout(()=>{
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
          
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);
    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //   try {
    //     recognition.start()
    //     console.log("Recognition requested to start");
    //   } catch (err) {
    //     if (err.name !== 'InvalidStateError') {
    //       console.error('Start error:', err)
    //     }
    //   }
    // }
    // }

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(()=>{
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
              
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length -1][0].transcript.trim();

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        console.log(data);
        handleCommand(data)
        setAiText(data.response)
      }
      
    }

    // const fallback = setInterval(() => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     safeRecognition()
    //   }
    // }, 10000)


    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };

  },[]);
  
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-3.75'>
      <button type='submit' className='min-w-37.5 h-15 mt-7.5 bg-white hover:bg-blue-700 text-black font-semibold absolute top-5 right-5 rounded-full text-[20px] cursor-pointer' onClick={handleLogout}>Log Out</button>
      <button type='submit' className='min-w-37.5 h-15 mt-7.5 bg-white hover:bg-blue-700 text-black font-semibold absolute top-25 right-5 rounded-full text-[20px] px-5 py-2.5 cursor-pointer' onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
      <div className='w-75 h-100 flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I am {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt='' className='w-50' />}
      {aiText && <img src={aiImg} alt='' className='w-50' />}
      <h1 className='text-white'>{aiText?aiText:null}</h1>
    </div>
  )
}

export default Home
