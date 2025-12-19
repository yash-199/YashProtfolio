import React from 'react'
import logo from "../assets/logo.png"
import Resume from "../assets/YASH KUMAR JHA.pdf"

const Navbar = () => {
  return (
    <div className="w-full z-10 mx-auto my-4 fixed left-1/2 -translate-x-1/2 bg-transparent rounded-full shadow-lg text-white">
      <div className="flex justify-between bg-transparent items-center px-10">
        <img src={logo} className='w-[80px] bg-transparent' alt="" />

        <a href={Resume} target="_blank" className='outline-none bg-transparent' rel="noopener noreferrer">
          <p className="text-lg bg-transparent">Resume</p>
        </a>
      </div>
    </div>
  )
}

export default Navbar
