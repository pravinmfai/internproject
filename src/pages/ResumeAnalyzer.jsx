import React from "react";
import Person from "../assets/thinking 1.png";
import NavBar from "../components/NavBar";
import backgroundimage from "../assets/Ellipse 9.png";

function ResumeAnalyzer() {
  return (
    // bg-gradient-to-b from-blue-200 to-white  max-sm:bg-gradient-to-t max-sm:from-blue-300/75 max-sm:to-white/75
    <>
      <NavBar />
      <div className=" relative z-10 flex gap-4 items-center justify-around p-4 h-screen max-sm:flex-col-reverse max-sm:gap-10  m-auto max-md:justify-center">
        <img
          src={backgroundimage}
          alt="Background"
          className="absolute  w-full h-full object-cover opacity-80  -z-10"
        />
        <div className="max-w-md flex flex-col gap-4 items-center justify-center max-sm:gap-0">
          <h1 className="text-4xl md:text-5xl  mb-8 text-center max-sm:mb-4 max-sm:text-3xl">
            Is your resume good enough?
          </h1>
          <div className=" p-8 rounded-[50px]  flex items-center flex-col  w-3/4 m-auto gap-4 max-sm:bg-transparent bg-white/75 max-sm:gap-2  max-sm:p-2 ">
            <div className="flex flex-col items-center gap-2">
              <p>
                <ion-icon
                  name="cloud-upload-outline"
                  className="w-16 h-16 text-blue-500 block max-sm:hidden"
                />
              </p>
              <button className="bg-[#1170CD] text-white py-4 w-52 rounded-full cursor-pointer hover:bg-[#0E5BAA] transition-all duration-300 max-sm:flex max-sm:items-center max-sm:justify-center max-sm:w-56 max-sm:py-5 max-sm:gap-2 ">
                <span>
                  <ion-icon
                    name="cloud-upload-outline"
                    className="w-6 h-6 hidden max-sm:block"
                  />
                </span>
                Upload your resume
              </button>
            </div>
            <div className="flex items-center ">
              <span>
                <ion-icon
                  name="lock-closed-outline"
                  className="w-6 h-6  block "
                ></ion-icon>
              </span>
              <p className="text-sm ">privacy guaranteed</p>
            </div>
          </div>
        </div>
        <div className=" max-w-md flex items-center justify-center max-md:w-3/4 max-sm:mx-auto">
          <img src={Person} alt="Person_resume" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}

export default ResumeAnalyzer;
