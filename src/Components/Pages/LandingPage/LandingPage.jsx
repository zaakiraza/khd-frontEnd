import Home from "../Home/Home";
import About from "../About/About";
import Testimonials from "../Testimonials/Testimonials";
import Contact from "../Contact/Contact";
function LandingPage() {
  return (
    <>
      <div id="home">
        <Home />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <footer
        style={{
          textAlign: "center",
          padding: "10px 0",
          background: "#f1f1f1",
        }}
      >
        <p>© 2025 KhuddamLearningOnline</p>
      </footer>
    </>
  );
}

export default LandingPage;
