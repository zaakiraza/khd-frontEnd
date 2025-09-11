import React from "react";
import "./About.css";

function About() {
  return (
    <>
      <div className="about">
        <h1>About Us</h1>
        <hr />
        <div className="text">
          <p>
            Khuddam Learning Online is a weekly Islamic classes platform for
            boys
            <span> age 10 to 17 years</span>. Interactive{" "}
            <span>Ulema sessions</span> in Urdu
          </p>
          <p>
            language with the help of Zoom video, Power point presentations,
            class activities, Q&A sessions from students, class
          </p>
          <p>
            assignments using google forms & <span>bonus questions</span>.
          </p>
        </div>
      </div>
      <div className="learn">
        <h1>What You Will Learn</h1>
        <hr />
        <div className="boxes">
            <img src="/box1.png" alt="" />
            <img src="/box2.png" alt="" />
            <img src="/box3.png" alt="" />
            <img src="/box4.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default About;
