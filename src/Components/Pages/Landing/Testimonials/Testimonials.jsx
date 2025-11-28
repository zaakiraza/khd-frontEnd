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
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % arr.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [current, arr.length]);

  const apiYoutubeKey = "AIzaSyBXsN3_orDJjTYHoyX4Xr7Aj10vuBjGBLA";
  const channelHandle = "@khuddamlearningonline";
  const [videos, setVideos] = useState([]);
  const [vidLoading, setVidLoading] = useState(false);
  const [vidError, setVidError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      if (!apiYoutubeKey || !channelHandle) return;
      setVidLoading(true);
      setVidError("");
      try {
        let uploadsPlaylistId = null;
        const handleResp = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(
            channelHandle.replace(/^@/, "")
          )}&key=${apiYoutubeKey}`
        );
        if (handleResp.ok) {
          const data = await handleResp.json();
          if (data.items && data.items[0]) {
            uploadsPlaylistId =
              data.items[0].contentDetails?.relatedPlaylists?.uploads;
          }
        }

        if (!uploadsPlaylistId) {
          const searchResp = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
              channelHandle.replace(/^@/, "")
            )}&maxResults=1&key=${apiYoutubeKey}`
          );
          if (searchResp.ok) {
            const sData = await searchResp.json();
            const channelId = sData.items?.[0]?.id?.channelId;
            if (channelId) {
              const chResp = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiYoutubeKey}`
              );
              if (chResp.ok) {
                const chData = await chResp.json();
                uploadsPlaylistId =
                  chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
              }
            }
          }
        }

        if (!uploadsPlaylistId) {
          throw new Error("Channel uploads playlist not found");
        }

        // Step 2: fetch latest 6 videos from uploads playlist
        const vidsResp = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=6&key=${apiYoutubeKey}`
        );
        if (!vidsResp.ok) throw new Error("Failed to fetch videos");
        const vidsData = await vidsResp.json();
        const parsed = (vidsData.items || [])
          .map((it) => ({
            id: it.contentDetails?.videoId,
            title: it.snippet?.title,
            thumb:
              it.snippet?.thumbnails?.medium?.url ||
              it.snippet?.thumbnails?.default?.url,
            publishedAt: it.contentDetails?.videoPublishedAt,
          }))
          .filter((v) => v.id);
        setVideos(parsed);
      } catch (err) {
        setVidError(err.message || "Error loading videos");
      } finally {
        setVidLoading(false);
      }
    };
    fetchVideos();
  }, [apiYoutubeKey, channelHandle]);

  return (
    <>
      <div className="testi" id="testimonials">
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
      <div className="recent">
        <h1>Recent Lectures</h1>
        <hr />
        <div className="youVideos">
          {vidLoading && <p>Loading latest videos...</p>}
          {vidError && <p style={{ color: "red" }}>{vidError}</p>}
          {!vidLoading && !vidError && videos.length === 0 && (
            <p>No recent videos found.</p>
          )}
          <div className="videosGrid">
            {videos.map((v) => (
              <div key={v.id}>
                <div className="videoWrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Testimonials;
