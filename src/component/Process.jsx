import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { BsFillFileEarmarkRichtextFill } from "react-icons/bs";
import { GoStack } from "react-icons/go";
import { FaCode } from "react-icons/fa6";
import { LuTestTube } from "react-icons/lu";
import { CgWebsite } from "react-icons/cg";
import HTML from "../assets/HTML.png";
import CSS from "../assets/CSS.png";
import Image from "../assets/backgroundImage.png";
import Laptop from "../assets/Laptop.png";
const Process = () => {
    const tab = [
        {
            id: "01",
            title: "Discovery",
            icon: <CiSearch />,
            desc: "Understanding your needs, goals, and project vision through discussion and research.",
            list1: "Initial consultation",
            list2: "Requirements analysis",
            list3: "Market & competitor research",
            list4: "Goal planning",
            list5: "Project clarity setup",
            img: HTML
        },
        {
            id: "02",
            title: "Design",
            icon: <GoStack />,
            desc: "Creating visually appealing and user-friendly UI/UX based on your needs.",
            list1: "Wireframes & layout planning",
            list2: "UI/UX design",
            list3: "Interactive prototyping",
            list4: "Client feedback integration",
            list5: "Design finalization",
            img: Laptop
        },
        {
            id: "03",
            title: "Development",
            icon: <FaCode />,
            desc: "Building fast, responsive, and scalable applications with clean code.",
            list1: "Frontend development",
            list2: "Backend development",
            list3: "API & database integration",
            list4: "Code optimization",
            list5: "Cross-platform compatibility",
            img: Image
        },
        {
            id: "04",
            title: "Launch & Testing",
            icon: <CgWebsite />,
            desc: "Thorough testing and seamless deployment for a smooth project launch.",
            list1: "Functionality testing",
            list2: "Performance optimization",
            list3: "Bug fixing",
            list4: "Final deployment",
            list5: "Post-launch support",
            img: CSS
        }
    ];


    const [openTab, setOpenTab] = useState("01")

    useEffect(() => {
        const interval = setInterval(() => {
            setOpenTab((prevTab => {
                const currentIndex = tab.findIndex(item => item.id === prevTab);
                const nextIndex = (currentIndex + 1) % tab.length;
                return tab[nextIndex].id;
            }))
        }, 3000);
        return () => clearInterval(interval);
    }, [])

    const toogleTab = (id) => {
        setOpenTab(openTab === id ? null : id)
    }
    return (
        <div>
            <p className='text-xl text-center text-gray-500'>My Process</p>
            <h1 className='text-5xl text-white text-center py-2'>How I Work</h1>
            <p className='text-gray-500 text-lg text-center py-2'>
                A structured approach to delivering exceptional results for your project.
            </p>
            <div className='w-[70rem] mx-auto my-10'>
                <div className='grid grid-cols-2 text-white'>
                    <div className='mx-10'>
                        {tab.map((item, index) => (
                            <div key={index}>
                                <div className='cursor-pointer border-white border-2 p-5 my-5 rounded-lg'>
                                    <p className='text-white' onClick={() => toogleTab(item.id)}>
                                        <div className='flex items-center gap-5'>
                                            <div className='bg-white rounded-lg flex items-center justify-center w-12 h-12 text-white'>
                                                <p className='rounded text-4xl'>{item.icon}</p>
                                            </div>
                                            <div>
                                                <p><span className='text-gray-500'>Step -</span> {item.id}</p>
                                                <p className='text-2xl'>{item.title}</p>
                                            </div>
                                        </div>
                                    </p>
                                    <div className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${openTab === item.id ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
        `}>
                                        <p className='pt-4 text-md text-gray-400'>{item.desc}</p>
                                        <ul className='list-disc ml-5 my-2 '>
                                            <li className='flex items-center gap-2'><IoIosArrowForward /> {item.list1}</li>
                                            <li className='flex items-center gap-2'><IoIosArrowForward /> {item.list2}</li>
                                            <li className='flex items-center gap-2'><IoIosArrowForward /> {item.list3}</li>
                                            <li className='flex items-center gap-2'><IoIosArrowForward /> {item.list4}</li>
                                            <li className='flex items-center gap-2'><IoIosArrowForward /> {item.list5}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {tab.map((item, index) =>
                            openTab === item.id && (
                                <img
                                    key={index}
                                    src={item.img}
                                    alt="process image"
                                    className="w-full h-auto"
                                />
                            )
                        )}
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Process
