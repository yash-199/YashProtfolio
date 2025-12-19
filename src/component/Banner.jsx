import React from 'react'
import Video from "../assets/promo.mp4"
const Banner = () => {
    return (
        <section className='lg:w-[70rem] mx-auto rounded-lg  bg-gradient-to-br from-[#1a1a2e] via-[#1a103d] to-[#0f0f1a] text-white lg:flex items-center justify-center px-10 py-10 my-20'>
            <div className='max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16 bg-transparent'>
                {/* Left content */}
                <div className='flex-1 bg-transparent'>
                    <button className='px-5 py-2 bg-white/10 text-white rounded-full border border-white/20'>
                        Start Your Website
                    </button>
                    <h1 className='bg-transparent text-2xl lg:text-4xl font-bold mt-6 leading-tight'>
                        Launch Your Website or Online  Business with confidence
                    </h1>
                    <p className='bg-transparent text-lg text-gray-300 mt-6 leading-relaxed max-w-xl'>
                        Have an idea? Looking to sell services or products?
                        Whether it’s a portfolio, blog, or eCommerce store,
                        I help turn your vision into a fully functional website.
                    </p>
                    <button className="mt-10 px-8 py-4 bg-white text-black font-semibold rounded-full flex items-center gap-3 hover:bg-gray-200 transition">
                        Launch Now →
                    </button>
                </div>
                {/* Right Content */}
                <div className='flex-1'>
                    <div className='border-4 border-white/20 rounded-lg overflow-hidden shadow-lg p-1'>
                        <video src={Video} autoPlay muted loop playsInline className="w-full h-full rounded-lg object-cover"></video>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
