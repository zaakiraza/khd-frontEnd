import HeroSlider from "../HeroSlider/HeroSlider";
import About from "../About/About";
import OurWinners from "../OurWinners/OurWinners";
import Testimonials from "../Testimonials/Testimonials";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

function LandingPage() {
  return (
    <>
      <div id="home">
        <HeroSlider />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="ourWinners">
        <OurWinners />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
