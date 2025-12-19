import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const Services = () => {
  // reusable animation skill renderer
  const renderSkills = (skills) => (
    <div className="absolute left-0 lg:mt-24 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out">
      <div className="lg:flex gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-full flex flex-wrap">
        {skills.map((skill, i) => (
          <p
            key={`${skill.name}-${i}`}
            className={`px-4 py-1 rounded-full text-sm ${skill.color} opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {skill.name}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="lg:w-[70rem] mx-auto text-white animate-fadeUp">
      <div className="lg:flex gap-20">
        {/* Left Heading Area */}
        <div className="lg:w-[30%] lg:px-0 px-2">
          <h1 className="text-6xl py-2">Services</h1>
          <h1 className="text-6xl py-2">That I Offer</h1>
          <p className="text-2xl font-light text-justify">
            Transforming visions into vibrant digital experiences with custom
            UI/UX design and responsive frontend development.
          </p>
        </div>

        {/* Right Services Area */}
        <div className="lg:w-[70%] lg:mt-0 mt-10">
          {/* ------------------ 01 Frontend Development ------------------ */}
          <div className="flex justify-around items-start border-t border-b border-white pt-6 pb-2 relative group">
            <p className="lg:text-3xl">01/</p>
            <h2 className="lg:text-5xl text-3xl">
              Frontend <br /> Development
            </h2>
            <BsArrowUpRightCircleFill className="lg:text-6xl text-4xl lg:my-8" />
            {renderSkills([
              { name: "HTML", color: "bg-red-500 text-black" },
              { name: "CSS", color: "bg-blue-500 text-white" },
              { name: "JavaScript", color: "bg-yellow-500 text-black" },
              { name: "Bootstrap", color: "bg-purple-500 text-white" },
              { name: "Tailwind CSS", color: "bg-cyan-500 text-black" },
              { name: "React.js", color: "bg-blue-600 text-white" },
              { name: "Next.js", color: "bg-green-600 text-white" },
              { name: "Responsive Design", color: "bg-teal-600 text-white" },
            ])}
          </div>

          {/* ------------------ 02 React Development ------------------ */}
          <div className="flex justify-around items-start border-t border-b border-white pt-6 pb-2 relative group">
            <p className="lg:text-3xl">02/</p>
            <h2 className="lg:text-5xl text-3xl">
              React.JS <br /> Development
            </h2>
            <BsArrowUpRightCircleFill className="lg:text-6xl text-4xl lg:my-8" />
            {renderSkills([
              { name: "JSX", color: "bg-blue-600 text-white" },
              { name: "Hooks", color: "bg-purple-600 text-white" },
              { name: "Context API", color: "bg-teal-600 text-white" },
              { name: "Redux Toolkit", color: "bg-indigo-600 text-white" },
              { name: "React Router", color: "bg-cyan-600 text-white" },
            ])}
          </div>

          {/* ------------------ 03 WordPress Development ------------------ */}
          <div className="flex justify-around items-start border-t border-b border-white pt-6 pb-2 relative group">
            <p className="lg:text-3xl">03/</p>
            <h2 className="lg:text-5xl text-3xl">
              WordPress <br /> Development
            </h2>
            <BsArrowUpRightCircleFill className="lg:text-6xl text-4xl lg:my-8" />
            {renderSkills([
              { name: "Theme Customization", color: "bg-blue-500 text-white" },
              { name: "Plugin Integration", color: "bg-green-600 text-white" },
              { name: "Elementor", color: "bg-purple-500 text-white" },
              { name: "WooCommerce", color: "bg-pink-500 text-white" },
              { name: "Divi Theme", color: "bg-yellow-500 text-black" },
              { name: "SEO Optimization", color: "bg-indigo-500 text-white" },
            ])}
          </div>

          {/* ------------------ 04 MERN Development ------------------ */}
          <div className="flex justify-around items-start border-t border-b border-white pt-6 pb-2 relative group">
            <p className="lg:text-3xl">04/</p>
            <h2 className="lg:text-5xl text-3xl">
              MERN <br /> Development
            </h2>
            <BsArrowUpRightCircleFill className="lg:text-6xl text-4xl lg:my-8" />
            {renderSkills([
              { name: "MongoDB", color: "bg-green-600 text-white" },
              { name: "Express.js", color: "bg-gray-700 text-white" },
              { name: "React.js", color: "bg-blue-600 text-white" },
              { name: "Node.js", color: "bg-green-700 text-white" },
              { name: "Mongoose", color: "bg-purple-600 text-white" },
              { name: "JWT Auth", color: "bg-indigo-600 text-white" },
              { name: "REST API", color: "bg-yellow-500 text-black" },
            ])}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
