import React from 'react'
import logo from "../assets/logo.png"
const Navbar = () => {
  return (
    <div className="
      w-10/12 mx-auto my-4 fixed left-1/2 -translate-x-1/2
      bg-white/10 backdrop-blur-md
      border border-white/20
      rounded-full shadow-lg text-white z-10
    ">
      <div className="flex items-center justify-between px-10 ">
        <img src={logo} className='w-[80px]' alt="" />
        <ul className="flex items-center gap-10 text-sm">
          <li className="text-lg">Home</li>
          <li className="text-lg">About</li>
          <li className="text-lg">Project</li>
          <li className="text-lg">Services</li>
        </ul>

        <p className="text-lg">Resume</p>

      </div>
    </div>
  )
}

export default Navbar
