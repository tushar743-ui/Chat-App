import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/auth-context'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [CurrState, setCurrState] = useState("Sign up")
  const [fullName, setfullName] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [bio, setbio] = useState("")
  const [isDataSubmitted, setisDataSubmitted] = useState(false)
  const [isLoading, setisLoading] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    // Validation
    if (CurrState === "Sign up" && !fullName.trim()) {
      toast.error("Please enter your full name")
      return
    }
    if (!email.trim()) {
      toast.error("Please enter your email")
      return
    }
    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    if (CurrState === 'Sign up' && !isDataSubmitted) {
      setisDataSubmitted(true)
      return
    }

    if (CurrState === "Sign up" && !bio.trim()) {
      toast.error("Please provide a bio")
      return
    }

    try {
      setisLoading(true)
      await login(
        CurrState === "Sign up" ? 'signup' : 'login',
        { fullName, email, password, bio }
      )
    } catch (error) {
      toast.error(error.message || "An error occurred")
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* -----left------- */}
      <img src={assets.logo_big} alt="Logo" className='w-[min(30vw,250px)]'/>

      {/* ----right------ */}
      <form
        onSubmit={onSubmitHandler}
        className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-full max-w-md'
      >

        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {CurrState}
          {isDataSubmitted &&
            <img
              onClick={() => setisDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className='w-5 cursor-pointer hover:opacity-75'
            />
          }
        </h2>

        {CurrState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setfullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black'
            placeholder='Full Name'
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black'
            />

            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black'
            />
          </>
        )}

        {CurrState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            rows={4}
            className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black'
            placeholder='Provide a short bio...'
            required
          ></textarea>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? "Loading..." : (CurrState === "Sign up" ? "Create Account" : "Login Now")}
        </button>

        <div className='flex flex-col gap-2'>
          {CurrState === "Sign up" ? (
            <p className='text-sm text-gray-300'>
              Already have an account{" "}
              <span
                onClick={() => { setCurrState("Login"); setisDataSubmitted(false) }}
                className='font-medium text-violet-300 cursor-pointer hover:text-violet-200'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-300'>
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                className='font-medium text-violet-300 cursor-pointer hover:text-violet-200'
              >
                Click here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage