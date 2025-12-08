import React, { useEffect, useState } from "react";
import icon from "../assets/icon.png";
import CrossText from "./CrossText";
import Typewriter from 'typewriter-effect';
const HeroSection = () => {
  const words = [
    "Hi There",
    "Hello",
    "Welcome",
    "Namaste",
    "नमस्ते",
    "Bonjour",
    "Hola",
    "Ciao",
    "こんにちは",
    "مرحبا",
  ];

  return (
    <div className="pt-36 text-center">
      {/* Changing Language Text */}
      <div className="typing-effect bg-transparent text-white relative text-center flex items-center justify-center gap-6">
        <div className="w-[50px] h-0.5 bg-white"></div>
        <div className="text-4xl font-light bg-transparent">
          <Typewriter
            options={{
              strings: words,
              autoStart: true,
              loop: true,
              pauseFor: 2000,
            }}
          />
        </div>
        <div className="w-[50px] h-0.5 bg-white"></div>
      </div>

      <h1 className="text-white text-center text-[10rem] font-bold">
        Yash Kumar Jha
      </h1>

      <p className="text-white text-7xl mt-[-26px] relative bg-transparent z-10">
        Full Stack & <span className="bg-transparent">Mern Stack</span> Developer
      </p>

      <div className="flex items-center justify-center relative bg-transparent -top-28">
        <img src={icon} alt="" className="w-1/6 bg-transparent" />
      </div>

      <div className="flex items-center justify-around text-white relative -top-[16rem] bg-transparent px-20 z-0">
        <p className="text-4xl font-normal bg-transparent">
          Frontend Developer
        </p>
        <p className="text-4xl font-normal bg-transparent">
          Based in Delhi/NCR, India.
        </p>
      </div>

      <div className="flex items-center justify-around relative -top-[14rem] bg-transparent px-20">
        <p className="text-3xl bg-white text-black rounded-full px-6 py-4 font-light">
          Get In Touch
        </p>
        <p className="text-3xl bg-white text-black rounded-full px-16 py-4 font-light">
          Hire Me
        </p>
      </div>

      <CrossText />
    </div>
  );
};

export default HeroSection;
