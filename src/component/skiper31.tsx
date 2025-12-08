"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

// Assets
import HTML from "../assets/HTML.png";
import CSS from "../assets/CSS.png";
import Bootstrap from "../assets/Bootstrap.jpg";
import JavaScript from "../assets/JavaScript.png";
import Tailwind from "../assets/TailwindCSS.webp";
import ReactLogo from "../assets/React.png";
import NextLogo from "../assets/next-js.svg";
import ReduxLogo from "../assets/Redux.png";
import WordPress from "../assets/WordPress.png";
import Elementor from "../assets/Elementor.png";
import Nodejs from "../assets/Nodejs.png";
import Express from "../assets/express-js.jpg";
import MongoDB from "../assets/Mongodb.png";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};

const CharacterV3: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const distance = index - centerIndex;

  // 🔥 Reduced values to prevent images from going outside
  const x = useTransform(scrollYProgress, [0, 1], [distance * 35, 0]);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-Math.abs(distance) * 10, 0]
  );
  const rotate = useTransform(scrollYProgress, [0, 1], [distance * 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <motion.img
      src={char}
      className="inline-block w-20 h-20 object-contain"
      style={{ x, y, rotate, scale, transformOrigin: "center" }}
    />
  );
};

const Skiper31: React.FC = () => {
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef3,
    offset: ["start end", "end start"], // ⭐ works even in 20vh height
  });

  const icons = [
    HTML,
    CSS,
    Bootstrap,
    JavaScript,
    Tailwind,
    ReactLogo,
    NextLogo,
    ReduxLogo,
    WordPress,
    Elementor,
    Nodejs,
    Express,
    MongoDB,
  ];

  const centerIndex = Math.floor(icons.length / 2);

  return (
    <ReactLenis root>
      {" "}
      <main className="w-full bg-black py-20">
        {" "}
        <div
          ref={targetRef3}
          className="relative flex h-[30vh] items-center justify-center bg-black"
        >
          <div
            className="text-center py-10 px-48"
            style={{ perspective: "200px" }}
          >
            {icons.map((img, i) => (
              <CharacterV3
                key={i}
                char={img}
                index={i}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </main>{" "}
    </ReactLenis>
  );
};

export default Skiper31;
