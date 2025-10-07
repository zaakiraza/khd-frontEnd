import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSlider.css";

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      backgroundImage: "/banner.jpg",
      title: "Welcome to Khuddam Learning Center",
      details: ["Zoom online classes", "Live classes from hoza"],
        buttonText: "Enroll Now",
        buttonAction: () => navigate("/new-admission/form"),
    },
    {
      id: 2,
      backgroundImage: "/banner.jpg",
      title: "What You Will Learn",
      details: ["Biography of Prophets", "Beliefs", "Fiqh", "Ethics"],
      buttonText: "Learn More",
      buttonAction: () => navigate("/#about"),
    },
    {
      id: 3,
      backgroundImage: "/banner.jpg",
      title: "Our Regular Classes",
      details: [
        "Weekly Class",
        "ONLY FOR BOYS AGE 10 TO 17 YEARS",
        "Every Friday (Atfaal) & Saturday (Other)",
        "Daily 7:30 PM – 09:00 PM (PST)",
      ],
      buttonText: "Enroll Now",
      buttonAction: () => navigate("/new-admission/form"),
    },
    {
      id: 4,
      backgroundImage: "/banner.jpg",
      title: "Mah e Ramadan Classes",
      details: [
        "Mah e Ramadan Special Classes",
        "ONLY FOR BOYS AGE 10 TO 17 YEARS",
        "Monday - Friday (Senior & Junior)",
        "Daily 5:00 PM – 6:00 PM (PST)",
      ],
      buttonText: "Enroll Now",
      buttonAction: () => navigate("/new-admission/form/ramzan"),
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="hero-slider" id="home">
      {/* Background Image */}
      <div
        className="slide-background"
        style={{ backgroundImage: `url(${currentSlideData.backgroundImage})` }}
      >
        <div className="slide-overlay"></div>
      </div>

      {/* Slide Content */}
      <div className="slide-content">
        <h1 className="slide-title">{currentSlideData.title}</h1>
        <hr className="slide-divider" />
        <div className="slide-details">
          {currentSlideData.details.map((detail, index) => (
            <p key={index}>{detail}</p>
          ))}
        </div>
        <button
          className="slide-button"
          onClick={currentSlideData.buttonAction}
        >
          {currentSlideData.buttonText}
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="slider-controls">
        {/* Previous Button */}
        <button className="nav-button prev-button" onClick={goToPrevSlide}>
          <span>‹</span>
        </button>

        {/* Next Button */}
        <button className="nav-button next-button" onClick={goToNextSlide}>
          <span>›</span>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="slide-counter">
        <span>
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
};

export default HeroSlider;
