"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

// Assets
import HTML from "../assets/HTML.png";
import CSS from "../assets/CSS.png";
import Bootstrap from "../assets/Bootstrap.jpg";
import JavaScript from "../assets/JavaScript.png";
import Tailwind from "../assets/Tailwind.png";
import ReactImg from "../assets/React.png";
import Next from "../assets/Nextjs.png";
import Redux from "../assets/Redux.png";
import WordPress from "../assets/WordPress.png";
import Nodejs from "../assets/Nodejs.png";
import Express from "../assets/Express.png";
import MongoDB from "../assets/Mongodb.png";

type CharacterProps = {
  char: string;
  title: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

const CharacterV3: React.FC<CharacterProps> = ({
  char,
  title,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const distance = index - centerIndex;

  // Make everything perfectly aligned when scrollYProgress ≈ 0.5 (section in center)
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [distance * 30, 0, distance * -30]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-Math.abs(distance) * 10, 0, Math.abs(distance) * 1]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [distance * 30, 0, distance * -30]
  );

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <motion.div
      style={{ x, y, rotate, scale }}
      className="flex flex-col items-center mx-4"
    >
      {/* Glassmorphic rounded card */}
      <div
        className="
          bg-white/10 
          backdrop-blur-xl 
          p-5 
          rounded-2xl 
          shadow-lg 
          shadow-black/40
          border border-white/10
          hover:shadow-white/20 
          hover:bg-white/15
          transition-all 
          duration-300
        "
      >
        <img
          src={char}
          className="w-20 h-20 object-contain bg-white p-2 rounded-lg"
          style={{ transformOrigin: "center" }}
        />
      </div>

      {/* Skill title */}
      <p className="text-white text-xs mt-3 font-light tracking-[0.18em] uppercase">
        {title}
      </p>
    </motion.div>
  );
};

const Skiper31: React.FC = () => {
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef3,
    // You can keep your old offset if you want,
    // but this makes the animation more center-focused
    offset: ["center 90%", "center 10%"],
  });

  const icons = [
    { img: HTML, title: "HTML" },
    { img: CSS, title: "CSS" },
    { img: Bootstrap, title: "Bootstrap" },
    { img: JavaScript, title: "JavaScript" },
    { img: Tailwind, title: "Tailwind CSS" },
    { img: ReactImg, title: "React" },
    { img: Next, title: "Next.js" },
    { img: Redux, title: "Redux" },
    { img: WordPress, title: "WordPress" },
    { img: Nodejs, title: "Node.js" },
    { img: Express, title: "Express" },
    { img: MongoDB, title: "MongoDB" },
  ];

  const centerIndex = Math.floor(icons.length / 2);

  return (
    <ReactLenis root>
      <main className="w-full bg-black py-20">
        {/* Section heading */}
        <div className="max-w-5xl mx-auto text-center mb-10 px-4">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            My Skillset
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mt-3 tracking-tight">
            Technical Skills &amp; Capabilities
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            A collection of tools and technologies I use to craft fast, modern,
            and engaging web experiences.
          </p>
        </div>

        <div
          ref={targetRef3}
          className="relative flex items-center justify-center bg-black"
        >
          <div
            className="flex flex-wrap justify-center items-center gap-y-6 px-6 md:px-16 lg:px-32"
            style={{ perspective: "200px" }}
          >
            {icons.map((item, i) => (
              <CharacterV3
                key={i}
                char={item.img}
                title={item.title}
                index={i}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
};

export default Skiper31;
