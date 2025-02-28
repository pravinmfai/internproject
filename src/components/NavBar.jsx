import React, { useState } from "react";
import logo from "../assets/M logo .png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { easeIn } from "motion";

function NavBar() {
  const [isopen, setIsopen] = useState(false);
  const parentVariants = {
    hidden: {
      opacity: 0,
      y: -100,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.3,
        easeIn: easeIn,
      },
    }),
  };

  return (
    <div>
      <nav className="container mx-auto">
        <ul className="flex justify-between items-center  mt-10 bg-white/80  p-4 rounded-full shadow-[0px_0px_69px_-3px_rgba(66,68,90,0.5)] max-sm:mt-4 max-sm:px-4 max-sm:py-2 max-sm:mx-2">
          <Link to="/">
            <img src={logo} alt="logo" className="w-10" />
          </Link>
          <li className="flex space-x-3 items-center max-sm:hidden">
            <Link>
              <button className="text-[#1170CD]  text-xl  hover:text-[#0E5BAA] transition-all duration-300 max-lg:text-base">
                Resume Analyse
              </button>
            </Link>
            <Link>
              <button className="bg-[#1170CD] text-white py-3 px-6 rounded-full  hover:bg-[#0E5BAA] transition-all duration-300  max-lg:text-base max-lg:py-2 max-lg:px-3">
                My Account
              </button>
            </Link>
            <Link>
              <button className="bg-[#1170CD] text-white py-3 px-6 rounded-full  hover:bg-[#0E5BAA] transition-all duration-300 max-lg:text-base max-lg:py-2 max-lg:px-3">
                Dash Board
              </button>
            </Link>
          </li>
          <li className="hidden max-sm:block">
            {!isopen ? (
              <ion-icon
                name="menu-outline"
                className="w-10 h-10 block max-sm:w-8 max-sm:h-8"
                onClick={() => setIsopen(true)}
              ></ion-icon>
            ) : (
              <ion-icon
                name="close-outline"
                className="w-10 h-10 block max-sm:w-8 max-sm:h-8"
                onClick={() => setIsopen(false)}
              ></ion-icon>
            )}
          </li>
        </ul>
        {isopen && (
          <div className="transfrom translate-y-10  top-10 left-10 w-[90%] mx-auto       h-full bg-white/80 flex items-center justify-center  ">
            <motion.div
              variants={parentVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/80 p-4  w-full h-1/2  relative -top-10 "
            >
              <motion.ul className="flex flex-col space-y-4 items-center">
                <Link>
                  <motion.button
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="text-[#1170CD]  text-xl  hover:text-[#0E5BAA] transition-all duration-300"
                  >
                    Resume Analyse
                  </motion.button>
                </Link>
                <Link>
                  <motion.button
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="bg-[#1170CD] text-white py-3 px-6 rounded-full  hover:bg-[#0E5BAA] transition-all duration-300 "
                  >
                    My Account
                  </motion.button>
                </Link>
                <Link>
                  <motion.button
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="bg-[#1170CD] text-white py-3 px-6 rounded-full  hover:bg-[#0E5BAA] transition-all duration-300"
                  >
                    Dash Board
                  </motion.button>
                </Link>
              </motion.ul>
            </motion.div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
