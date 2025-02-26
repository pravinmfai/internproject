import React from "react";
import login from "../assets/illustration 1.png";
import logo from "../assets/Google__G__logo 1.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,

        ease: "easeInOut",
      }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <div
        className="flex  items-center justify-evenly gap-2 rounded-2xl p-8 mx-auto max-w-5xl w-full md:p-4"
        style={{ boxShadow: "0px 10px 30px 10px rgb(186, 213, 238)" }}
      >
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Login</h1>
          <div className="flex flex-col items-center justify-start gap-6 w-full p-4">
            <input
              className="border border-gray-400 p-4 outline-none shadow-md rounded-md focus:ring-1 focus:ring-blue-600  text-center max-sm:rounded-full max-sm:w-full w-80 m-auto "
              type="text"
              placeholder="Email"
            />
            <input
              className="border border-gray-400 p-4 outline-none shadow-md  rounded-md focus:ring-1 focus:ring-blue-600 text-center max-sm:rounded-full max-sm:w-full  w-80 m-auto"
              type="password"
              placeholder="Password"
            />

            <button className="bg-[#1170CD] text-white p-2 w-40 rounded-full cursor-pointer hover:bg-[#0E5BAA] transition-all duration-300">
              login
            </button>

            <div className="flex items-center gap-2 w-[70%] max-w-sm ">
              <span className="flex-1 border-t-2 border-[#2C7FD0]"></span>
              <p className="text-gray-500">or</p>
              <span className="flex-1 border-t-2 border-[#2C7FD0]"></span>
            </div>

            <button className="bg-[#1170CD] text-white p-2 w-full max-w-xs rounded-xl shadow-md hover:bg-[#0E5BAA] transition-all duration-300">
              <div className="flex items-center justify-center gap-2">
                <img src={logo} alt="Google_logo" className="w-6" />
                <span>Sign in with Google</span>
              </div>
            </button>

            <p className="text-center max-sm:text-sm text-gray-500">
              New to builder?
              <span
                className="text-[#1170CD] ml-1 cursor-pointer hover:text-[#0E5BAA] transition-all duration-300"
                onClick={() => navigate("/signup")}
              >
                 Create an account
              </span>
            </p>
          </div>
        </div>

        <div className="max-md:hidden overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.2, transition: { duration: 0.5 } }}
            src={login}
            className="w-full h-auto"
            alt="Login Illustration"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
