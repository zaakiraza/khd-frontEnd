import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({});
  const userData = async () => {
    const user = await axios.get(`${BASEURL}/users/single`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserDetails(user.data.data);
  };
  useEffect(() => {
    userData();
  }, []);
  return (
    <div>
      <h1>hello here is {userDetails?.personal_info?.first_name ?? "..."}</h1>
    </div>
  );
}

export default StudentDashboard;