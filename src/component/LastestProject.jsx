import React, { useState } from 'react'
import LaptopImg from "../assets/Laptop.png"
import Frontend from "../assets/Frontend.png"
import FullStack from "../assets/FullStack.png"
import { BsArrowDownRightCircleFill } from "react-icons/bs";
// import { BsArrowUpDownCircleFill } from "react-icons/bs";
const LastestProject = () => {
    const [activeTab, setActiveTab] = useState(1);

    const tab = [
        { id: 1, title: "Frontend Development", img: Frontend },
        { id: 2, title: "Full Stack Development", img: FullStack },
    ]
    return (
        <div className='w-[70rem] mx-auto text-white mt-20'>
            <div className='flex items-center justify-center'>
                <h1 className='text-center text-6xl pb-10'>Latest Project</h1>
                <img src={LaptopImg} className='relative right-2 bg-transparent' alt="" />
            </div>
            {/* Tab */}
            <div className='w-[40rem] mx-auto my-10'>
                {tab.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="border-white border-t border-b cursor-pointer"
                    >
                        {/* Animated content wrapper */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out 
      ${activeTab === tab.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <img src={tab.img} alt="" className="w-full" />
                        </div>

                        {/* Header row (always visible) */}
                        <div className="flex items-start justify-between my-10">
                            <p className="text-3xl">{tab.id.toString().padStart(2, "0")}/</p>

                            <h2 className="text-5xl">
                                {tab.title.split(" ").slice(0, 1)} &nbsp;
                                {tab.title.split(" ").slice(1).join(" ")}
                            </h2>

                            <BsArrowDownRightCircleFill
                                className={`text-6xl transition-transform duration-500 
        ${activeTab === tab.id ? "-rotate-90" : "rotate-0"}`}
                            />
                        </div>
                    </div>
                ))}

            </div>
            <div className='flex justify-center items-center'>
                <p className='text-center bg-white/10 px-10 py-2 cursor-pointer rounded-full hover:bg-white shadow-white hover:text-black duration-150 translate-x-[-2]'>View All</p>
            </div>
        </div>
    )
}

export default LastestProject
