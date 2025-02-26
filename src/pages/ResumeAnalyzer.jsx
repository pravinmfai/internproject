import React from "react";
import Person from "../assets/thinking 1.png";

function ResumeAnalyzer() {
  return (
    <div className="flex gap-4 items-center justify-center  p-4 bg-blue-200">
      <div className="max-w-md flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl md:text-5xl  mb-8 text-center">
          Is your resume good enough?
        </h1>
        <div className="bg-white p-8 rounded-xl  flex items-center flex-col  w-3/4 m-auto gap-4">
          <div className="flex flex-col items-center">
            <p>
              <ion-icon
                name="cloud-upload-outline"
                className="w-16 h-16 text-blue-500 block"
              />
            </p>
            <button className="bg-[#1170CD] text-white p-2 w-40 rounded-full cursor-pointer hover:bg-[#0E5BAA] transition-all duration-300">
              Upload your resume
            </button>
          </div>
          <div className="flex items-center ">
            <span>
              <ion-icon
                name="lock-closed-outline"
                className="w-6 h-6  block"
              ></ion-icon>
            </span>
            <p className="text-sm ">privacy guaranteed</p>
          </div>
        </div>
      </div>
      <div>
        <img src={Person} alt="Person_resume" className="w-full h-full" />
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
