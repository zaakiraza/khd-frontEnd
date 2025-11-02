import React, { useState } from "react";
import "./ourWinners.css";

const OurWinners = () => {
  const [selectedSession, setSelectedSession] = useState("2025 Shaban");
  const [hoveredCard, setHoveredCard] = useState(null);

  const winnersData = {
    "2025 Shaban": [
      {
        id: 1,
        name: "Zakir Raza",
        session: "2025 Shaban",
        darja: "Darja e Doam",
        rank: 1,
        image: "/images.jpg",
        achievement: "Outstanding Performance",
        score: "98%",
      },
      {
        id: 2,
        name: "Ali Hussain",
        session: "2025 Shaban",
        darja: "Darja e Awal",
        rank: 2,
        image: "/images.jpg",
        achievement: "Excellent Scholar",
        score: "96%",
      },
      {
        id: 3,
        name: "Hussain Abbas",
        session: "2025 Shaban",
        darja: "Darja e Awal",
        rank: 3,
        image: "/images.jpg",
        achievement: "Distinguished Student",
        score: "94%",
      },
    ],
    "2025 Rajab": [
      {
        id: 4,
        name: "Muhammad Ahmed",
        session: "2025 Rajab",
        darja: "Darja e Doam",
        rank: 1,
        image: "/images.jpg",
        achievement: "Top Performer",
        score: "97%",
      },
      {
        id: 5,
        name: "Hassan Ali",
        session: "2025 Rajab",
        darja: "Darja e Awal",
        rank: 2,
        image: "/images.jpg",
        achievement: "Exceptional Student",
        score: "95%",
      },
      {
        id: 6,
        name: "Raza Mehdi",
        session: "2025 Rajab",
        darja: "Darja e Doam",
        rank: 3,
        image: "/images.jpg",
        achievement: "Merit Scholar",
        score: "93%",
      },
    ],
    "2024 Ramadan": [
      {
        id: 7,
        name: "Jafar Sadiq",
        session: "2024 Ramadan",
        darja: "Darja e Awal",
        rank: 1,
        image: "/images.jpg",
        achievement: "First Position",
        score: "99%",
      },
      {
        id: 8,
        name: "Musa Kazim",
        session: "2024 Ramadan",
        darja: "Darja e Doam",
        rank: 2,
        image: "/images.jpg",
        achievement: "Excellence Award",
        score: "97%",
      },
      {
        id: 9,
        name: "Abbas Raza",
        session: "2024 Ramadan",
        darja: "Darja e Awal",
        rank: 3,
        image: "/images.jpg",
        achievement: "Honor Roll",
        score: "95%",
      },
    ],
  };

  const sessions = Object.keys(winnersData);
  const currentWinners = winnersData[selectedSession];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "bronze";
      default:
        return "default";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <i className="fas fa-crown"></i>;
      case 2:
        return <i className="fas fa-medal"></i>;
      case 3:
        return <i className="fas fa-award"></i>;
      default:
        return <i className="fas fa-trophy"></i>;
    }
  };

  return (
    <div className="ourWinner">
      <div className="winner-header">
        <h1 className="winner-title">
          <span className="trophy-icon">
            <i className="fas fa-trophy"></i>
          </span>
          Our Outstanding Winners
          <span className="trophy-icon">
            <i className="fas fa-trophy"></i>
          </span>
        </h1>
        <p className="winner-subtitle">
          Celebrating Excellence and Academic Achievement
        </p>
        <hr className="winner-divider" />
      </div>

      {/* Session Filter Tabs */}
      <div className="session-tabs">
        {sessions.map((session) => (
          <button
            key={session}
            className={`session-tab ${
              selectedSession === session ? "active" : ""
            }`}
            onClick={() => setSelectedSession(session)}
          >
            {session}
          </button>
        ))}
      </div>

      {/* Winners Cards */}
      <div className="winnersCards">
        {currentWinners.map((winner, index) => (
          <div
            key={winner.id}
            className={`winnerCard ${getRankColor(winner.rank)} ${
              hoveredCard === winner.id ? "hovered" : ""
            }`}
            onMouseEnter={() => setHoveredCard(winner.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="card-badge">
              <span className="rank-icon">{getRankIcon(winner.rank)}</span>
            </div>

            <div className="winner-image-container">
              <img
                src={winner.image}
                alt={winner.name}
                className="winner-image"
              />
              <div className="image-overlay">
                <span className="overlay-rank">#{winner.rank}</span>
              </div>
            </div>

            <div className="winner-content">
              <div className="winner-info">
                <h2 className="winner-name">{winner.name}</h2>
                <div className="winner-details">
                  <p className="detail-item">
                    <span className="detail-icon">
                      <i className="fas fa-book"></i>
                    </span>
                    {winner.darja}
                  </p>
                  <p className="detail-item">
                    <span className="detail-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </span>
                    {winner.session}
                  </p>
                  <p className="detail-item achievement">
                    <span className="detail-icon">
                      <i className="fas fa-star"></i>
                    </span>
                    {winner.achievement}
                  </p>
                  <p className="detail-item score">
                    <span className="detail-icon">
                      <i className="fas fa-chart-line"></i>
                    </span>
                    Score: <strong>{winner.score}</strong>
                  </p>
                </div>
              </div>

              <div className="winner-ranking">
                <div className={`rank-badge rank-${winner.rank}`}>
                  <span className="rank-number">{winner.rank}</span>
                  <span className="rank-suffix">
                    {winner.rank === 1 ? "st" : winner.rank === 2 ? "nd" : "rd"}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-shine"></div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="winners-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-number">{currentWinners.length}</div>
          <div className="stat-label">Top Performers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-number">
            {Math.round(
              currentWinners.reduce((sum, w) => sum + parseFloat(w.score), 0) /
                currentWinners.length
            )}
            %
          </div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-number">{sessions.length}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
      </div>
    </div>
  );
};

export default OurWinners;
