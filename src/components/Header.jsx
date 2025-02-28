import React from 'react'
import backgroundimage from "../assets/Ellipse 9.png";
import heroImage from "../assets/hero.png";
import hero from "../assets/home-Photoroom 1.png";
import { motion } from "framer-motion";

function Header() {
  return (
    <div>
       <div className=" relative z-10  h-screen max-sm:flex-col-reverse max-sm:gap-10  flex items-center justify-around  ">
        <img
          src={backgroundimage}
          alt="Background"
          className="absolute  w-full h-full object-cover opacity-80  -z-10"
        />
        <motion.div className="flex  flex-col gap-4 items-center justify-center max-md:justify-start ">
          <div className="w-[70%] h-[70%]">
            <img src={heroImage} alt="" className="w-full h-full" />
          </div>
          <div className=" w-[80%] flex flex-col gap-4 items-center justify-center">
            <h2 className="text-3xl text-center">
              The professional resume builder
            </h2>
            <p className=" text-center text-xl font-normal max-sm:text-base ">
              Easily craft a professional resume with customizable templates and
              expert guidance
            </p>
          </div>
          <motion.button className="bg-[#1170CD] text-white p-2 w-40 rounded-full cursor-pointer hover:bg-[#0E5BAA] transition-all duration-300">
            resume builder
          </motion.button>
        </motion.div>
        <div className="w-[30%] max-md:hidden ">
          <motion.img src={hero} alt="hero" className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}

export default Header
