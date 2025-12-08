import React from "react";
import { FaInstagram } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <section className="max-w-[80rem] mx-auto text-white py-20">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10">

                {/* Heading */}
                <div className="w-full md:w-[70%] space-y-4">
                    <h1 className="text-[6rem] md:text-[8rem] font-extrabold leading-[0.8]">
                        Follow Me
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300">
                        Stay tuned for the latest design trends <br /> and development insights!
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex w-full md:w-[30%] justify-center items-center gap-6 md:gap-10">
                    {[FaInstagram, IoLogoGithub, FaLinkedin].map((Icon, i) => (
                        <Icon
                            key={i}
                            className="text-5xl md:text-6xl cursor-pointer border border-white/40 p-3 rounded-xl hover:bg-white hover:text-black transition duration-200"
                        />
                    ))}
                </div>
            </div>

            <hr className="border-white/20 my-12" />

            {/* Middle Branding Section */}
            <div className="text-center">
                <img src={logo} className="mx-auto w-40 opacity-90" />

                <h1 className="text-4xl md:text-5xl font-light py-2">
                    FROM CONCEPT TO <b>CREATION</b>
                </h1>
                <h1 className="text-4xl md:text-5xl font-light py-2">
                    LET'S MAKE IT <b>HAPPEN!</b>
                </h1>

                {/* Circular Badge */}
                <div className="relative w-[110px] h-[110px] mx-auto my-10">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="spin-slow rounded-full bg-black border-blue-500 border-4">
                            <svg
                                fill="black"
                                viewBox="0 0 100 100"
                                className="w-full h-full text-white"
                            >
                                <path
                                    id="circlePath"
                                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                    fill="transparent"
                                ></path>
                                <text fontSize="11" letterSpacing="4px" fill="white">
                                    <textPath href="#circlePath">
                                        OPEN TO WORK · OPEN TO WORK · OPEN TO WORK ·
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Arrow Icon */}
                    <svg
                        className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rotate-45 text-white  opacity-80"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z"></path>
                    </svg>
                </div>

                {/* Button */}
                <button className="bg-white/10 px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-200">
                    Get In Touch
                </button>

                {/* Bottom Text */}
                <div className="mt-6">
                    <p className="text-2xl font-bold">
                        I'm available for full-time roles & freelance projects.
                    </p>
                    <p className="text-lg text-gray-400 mt-2">
                        I love crafting dynamic web applications <br /> and delivering seamless user experiences.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Footer;
