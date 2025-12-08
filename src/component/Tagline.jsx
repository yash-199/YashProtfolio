import React from 'react'
import TaglineImg from "../assets/Tagline.png"
const Tagline = () => {
    return (
        <div className='w-[70rem] mx-auto text-white'>
            <div className='flex gap-20'>
                <div className='w-[40%]'>
                    <img src={TaglineImg} loading='lazy' alt="" />
                </div>
                <div className='w-[60%]'>
                    <p className='text-justify text-5xl py-20'>"I thrive on building frontend wonders that scale smoothly, while sprinkling them with delightful user experiences!"</p>
                </div>
            </div>
        </div>
    )
}

export default Tagline
