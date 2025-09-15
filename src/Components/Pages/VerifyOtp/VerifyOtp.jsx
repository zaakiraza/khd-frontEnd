import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyOtp.css";

function VerifyOtp() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [values, setValues] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const checkVerify = async () => {
    const isVerified = await axios.get(`${BASEURL}/users/single`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(isVerified.data.data.personal_info.verified){
      navigate("/UserDashboard");
    }
  };
  useEffect(() => {
    checkVerify();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    const handleKey = (e) => {
      const isRefresh =
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"));
      if (isRefresh) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleBeforeUnload = (e) => {
      // Show a confirmation — modern browsers may ignore custom message
      e.preventDefault();
      e.returnValue = "You cannot refresh this page while verifying OTP.";
      return e.returnValue;
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) {
      updateValueAt(index, "");
      return;
    }

    if (val.length > 1) {
      const newVals = [...values];
      for (let i = 0; i < val.length && index + i < 4; i++) {
        newVals[index + i] = val[i];
      }
      setValues(newVals);
      const nextIdx = Math.min(3, index + val.length);
      inputsRef.current[nextIdx]?.focus();
      return;
    }

    updateValueAt(index, val);
    if (val && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const updateValueAt = (index, val) => {
    setValues((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        updateValueAt(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateValueAt(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const otp = values.join("");
    if (!otp || otp.length < 4)
      return setError("Please enter the 4-digit OTP.");
    if (!token) return setError("Missing authentication token.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASEURL}/auth/verifyOtp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data?.message || "OTP verified successfully.");
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Network error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage(null);
    setError(null);
    if (!token) return setError("Missing authentication token.");

    setResending(true);
    try {
      const res = await axios.post(`${BASEURL}/auth/resendOtp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data?.message || "OTP resent. Check your email.");
      setValues(["", "", "", ""]);
      setSecondsLeft(60);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
      }, 1000);
      inputsRef.current[0]?.focus();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Network error";
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(1, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="verify-otp-page">
      <form
        className="otp-card"
        onSubmit={handleSubmit}
        onPaste={(e) => e.preventDefault()}
      >
        <h2>Verify OTP</h2>
        <p className="subtitle">
          Enter the 4-digit code sent to your phone/email.
        </p>

        <div className="otp-inputs">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="otp-input"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData(
                  "text"
                );
                if (paste) handleChange(i, { target: { value: paste } });
              }}
            />
          ))}
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={secondsLeft === 0 || loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </div>

        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}

        <div className="timer">
          Time left: <span className="time">{formatTime(secondsLeft)}</span>
        </div>

        {secondsLeft === 0 && (
          <div className="expired">
            OTP expired. Please resend to get a new code.
          </div>
        )}
      </form>
    </div>
  );
}

export default VerifyOtp;
