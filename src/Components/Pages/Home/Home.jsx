import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const naviReg = () => {
    navigate("/new-admission/form");
  };
  return (
    <div className="home" id="home">
      <h1>KHUDDAM LEARNING ONLINE</h1>
      <hr />
      <div className="details">
        <p>Weekly Class</p>
        <p>ONLY FOR BOYS AGE 10 TO 17 YEARS</p>
        <p>Every Friday (Atfaal) & Saturday (Other)</p>
        <p>Daily 7:30 PM – 09:00 PM (PST)</p>
      </div>
      <button onClick={naviReg}>Register Now</button>
    </div>
  );
}

export default Home;
