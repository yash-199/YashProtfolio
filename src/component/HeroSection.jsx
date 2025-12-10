import React from "react";
import face from "../assets/face.png";
import CrossText from "./CrossText";
import Typewriter from "typewriter-effect";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const HeroSection = () => {
  useGSAP(() => {
    // Split title
    const split = new SplitText(".hero-title", { type: "chars" });

    const tl = gsap.timeline({ delay: 0.5 });

    // 1️⃣ Typewriter (bottom to top)
    tl.from(".typing-effect", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    })

      // 2️⃣ Hero Content wrapper
      .to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })

      // 3️⃣ Title background reveal
      .from(
        ".hero-title",
        {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4"
      )

      // 4️⃣ Split characters
      .from(
        split.chars,
        {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.7"
      )

      // 5️⃣ Subtitle
      .from(
        ".hero-subtitle",
        {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.5"
      )

      // 6️⃣ Icon
      .from(
        ".hero-icon",
        {
          opacity: 0,
          y: 60,
          duration: 1,
        },
        "-=0.6"
      )

      // 7️⃣ Info text (stagger)
      .from(
        ".hero-info p",
        {
          opacity: 0,
          y: 40,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.7"
      )

      // 8️⃣ Buttons (one by one)
      .from(
        ".hero-buttons p",
        {
          opacity: 0,
          y: 50,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.6"
      );

    // Scroll parallax
    gsap.from(".hero-container", {
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top 90%",
        end: "bottom top",
        scrub: true,
      },
      y: 40,
      opacity: 0.7,
    });
  }, []);

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
    <div className="pt-16 text-center hero-container z-10">

      {/* Typewriter Section */}
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

      {/* HERO CONTENT (Your tailwind preserved exactly) */}
      <div className="hero-content opacity-0 bg-transparent relative z-10 w-full h-full flex flex-col 2xl:justify-center items-center translate-y-10 2xl:pt-0">

        <div className="overflow-hidden bg-transparent z-[-10]">

          <h1 className="hero-title bg-transparent text-white 2xl:text-[8.5rem] md:text-[6.5rem] text-[3.5rem] font-bold uppercase leading-[9vw] tracking-[-.35rem] 2xl:mb-0 ">
            Yash Kumar Jha
          </h1>

          <p className="hero-subtitle text-white text-7xl relative bg-transparent z-10">
            Frontend & <span className="bg-transparent">Mern Stack</span> Developer
          </p>

          <div className="hero-icon flex items-center justify-center relative bg-transparent">
            <img src={face} alt="" className="w-1/6 bg-transparent" />
          </div>

          <div className="hero-info flex items-center justify-around text-white relative -top-[10rem] bg-transparent px-20 z-0">
            <p className="text-4xl font-normal bg-transparent">Frontend Developer</p>
            <p className="text-4xl font-normal bg-transparent">Based in Delhi/NCR, India.</p>
          </div>

          <div className="hero-buttons flex items-center justify-around relative -top-[8rem] bg-transparent px-20">
            <p className="text-3xl bg-white text-black rounded-full px-6 py-4 font-light">Get In Touch</p>
            <p className="text-3xl bg-white text-black rounded-full px-16 py-4 font-light">Hire Me</p>
          </div>
        </div>
      </div>
      <CrossText />
    </div>
  );
};

export default HeroSection;
