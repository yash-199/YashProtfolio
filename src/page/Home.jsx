import Navbar from "../component/Navbar";
import HeroSection from "../component/HeroSection";
import CrossText from "../component/CrossText";
import AboutUs from "../component/AboutUs";
import Skill from "../component/Skill";
import Projects from "../component/Projects";
import Experience from "../component/Experience";
import Contact from "../component/Contact";
import Footer from "../component/Footer";

const Home = ({ ready }) => (
  <>
    <a
      href="#main"
      className="sr-only z-[95] rounded-full bg-paper px-5 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
    <Navbar ready={ready} />
    <main id="main">
      <HeroSection ready={ready} />
      <CrossText />
      <AboutUs />
      <Skill />
      <Projects />
      <Experience />
      <Contact />
    </main>
    <Footer />
  </>
);

export default Home;
