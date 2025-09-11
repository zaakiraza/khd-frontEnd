import React, { useState, useEffect, useRef } from "react";
import "./Testimonials.css";

function Testimonials() {
  const arr = [
    {
      text: "“Congrats to Khuddam team members for great efforts, where nothing will get without money your team delivers excellent quality of education without money. May Allah accept your sacrifice, efforts and prosperity. I proud to say Khuddam Team great and professional.”",
      name: "- Syed Ali Mehdi (Abu Dhabi)",
    },
    {
      text: "“Your effort is very precious. I am heartily thankful for all your team members .i am very satisfied with your precious deed, may Allah s.w.t. give your team excellent reward”",
      name: "- Mohamed Hussain (Saudia Arabia)",
    },
    {
      name: "- Feroz Ali (India)",
      text: "“Waiting for your next Online Class. Appreciate your efforts to educate the youth, Jazakallahkhair!”",
    },
    {
      name: "- Muhammad Salman (USA)",
      text: "“We are thanks to you for teaching our child in these sitution and we appriciate your team efforts Thanks.”",
    },
  ];
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();
  const next = () => setCurrent((c) => (c + 1) % arr.length);
  const prev = () => setCurrent((c) => (c - 1 + arr.length) % arr.length);
  const goTo = (idx) => setCurrent(idx);

  useEffect(() => {
    // Clear previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % arr.length);
    }, 2000); // 4 seconds
    return () => clearInterval(intervalRef.current);
  }, [current, arr.length]);
  return (
    <div className="testi">
      <h1>Testimonials</h1>
      <hr />
      <img src="/quotes.png" alt="" />
      <div className="quotes">
        <div className="carousel">
          <button className="arrow left" onClick={prev} aria-label="Previous">
            &#60;
          </button>
          <div className="carousel-content">
            <p className="quote-text">{arr[current].text}</p>
            <p className="quote-name">{arr[current].name}</p>
          </div>
          <button className="arrow right" onClick={next} aria-label="Next">
            &#62;
          </button>
        </div>
        <div className="carousel-dots">
          {arr.map((_, idx) => (
            <span
              key={idx}
              className={"dot" + (idx === current ? " active" : "")}
              onClick={() => goTo(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
