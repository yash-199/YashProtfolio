import React from 'react'
import Navbar from '../component/Navbar'
import HeroSection from '../component/HeroSection'
import Services from '../component/Services'
import AboutUs from '../component/AboutUs'
import Tagline from '../component/Tagline'
import LastestProject from '../component/LastestProject'
import Skill from '../component/Skill'
import Process from '../component/Process'
import Banner from '../component/Banner'
import Footer from '../component/Footer'
const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Services />
      <Tagline />
      <Banner />
      <LastestProject />
      <Skill />
      <Process />
      <Footer />
      {/* <AboutUs /> */}
    </div>
  )
}

export default Home