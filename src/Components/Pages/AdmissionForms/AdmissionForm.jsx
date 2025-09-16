import React, { useState } from "react";
import "./AdmissionForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdmissionForm() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const CLOUD_NAME = (
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
  ).toLowerCase();
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear().toString();

  const [personal_info, setPersonal_info] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    gender: "",
    whatsapp_no: "",
    dob: "",
    age: "",
    CNIC: "",
    alternative_no: "",
    email: "",
    address: "",
    city: "",
    country: "",
    img_URL: "",
    doc_img: "",
    enrolled_year: currentYear,
    marj_e_taqleed: "",
  });

  personal_info.enrolled_year = currentYear;

  const [academic_progress, setAcademic_progress] = useState({
    academic_class: "",
    institute_name: "",
    inProgress: "",
    result: "",
  });

  const [previous_madrassa, setPrevious_madrassa] = useState({
    name: "",
    topic: "",
  });

  const [bank_details, setBank_details] = useState({
    bank_name: "",
    account_number: "",
    account_title: "",
    branch: "",
  });

  const [guardian_info, setGuardian_info] = useState({
    name: "",
    relationship: "",
    email: "",
    whatsapp_no: "",
    address: "",
    CNIC: "",
  });

  // const [formattedData, setFormattedData] = useState({});

  const [errors, setErrors] = useState({});
  const [togglefirst, setTogglefirst] = useState("▸");
  const [togglesecond, setTogglesecond] = useState("▸");
  const [togglethird, setTogglethird] = useState("▸");
  const [togglefourth, setTogglefourth] = useState("▸");
  const [togglefifth, setTogglefifth] = useState("▸");
  const [whatsappCode, setWhatsappCode] = useState("+92");
  const [alternativeCode, setAlternativeCode] = useState("+92");
  const [profileFile, setProfileFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guardianWhatsappCode, setGuardianWhatsappCode] = useState("+92");

  // const formatDobWithSlashes = (d) => {
  //   if (!d) return "";
  //   const parts = d.split("-");
  //   if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  //   return d;
  // };

  const countryCodes = [
    { code: "+92", label: "PK +92" },
    { code: "+91", label: "IN +91" },
    { code: "+880", label: "BD +880" },
    { code: "+971", label: "AE +971" },
    { code: "+44", label: "UK +44" },
    { code: "+1", label: "US +1" },
  ];

  const calculateAge = (dobStr) => {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return "";
    const now = new Date();
    if (now < dob) return "0.0";
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return `${years}.${months}`;
  };

  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = () => {
    const newErr = {};

    // Personal info required fields
    const reqPersonal = [
      ["img_URL", personal_info.img_URL, "Profile image is required"],
      ["first_name", personal_info.first_name, "First name is required"],
      ["last_name", personal_info.last_name, "Last name is required"],
      ["father_name", personal_info.father_name, "Father name is required"],
      ["dob", personal_info.dob, "Date of birth is required"],
      ["age", personal_info.dob, "Age is required"],
      ["gender", personal_info.gender, "Gender is required"],
      ["whatsapp_no", personal_info.whatsapp_no, "Whatsapp number is required"],
      ["CNIC", personal_info.CNIC || personal_info.cnic, "CNIC is required"],
      ["city", personal_info.city, "City is required"],
      ["address", personal_info.address, "Address is required"],
      [
        "alternative_no",
        personal_info.alternative_no,
        "Alternative number is required",
      ],
      ["email", personal_info.email, "Email is required"],
      ["country", personal_info.country, "Country is required"],
      [
        "marj_e_taqleed",
        personal_info.marj_e_taqleed,
        "marj_e_taqleed is required",
      ],
      ["doc_img", personal_info.doc_img, "Document image is required"],
    ];
    reqPersonal.forEach(([k, v, msg]) => {
      if (!v) newErr[k] = msg;
    });

    // Email format
    if (!personal_info.email) {
      newErr.email = "Invalid email format";
    }

    // Academic required
    if (!academic_progress.academic_class)
      newErr.academic_class = "Academic class is required";
    if (!academic_progress.institute_name)
      newErr.institute_name = "Institute name is required";
    if (academic_progress.inProgress === "")
      newErr.inProgress = "In-progress status is required";
    if (academic_progress.inProgress === "no" && !academic_progress.result)
      newErr.result = "Result is required";

    // Guardian required
    if (!guardian_info.name) newErr.guardian_name = "Guardian name is required";
    if (!guardian_info.relationship)
      newErr.relationship = "Guardian relationship is required";
    if (!guardian_info.email)
      newErr.guardian_email = "Guardian email is required";
    if (!guardian_info.email) newErr.guardian_email = "Invalid guardian email";
    if (!guardian_info.whatsapp_no)
      newErr.guardian_whatsapp = "Guardian whatsapp is required";
    if (!guardian_info.address)
      newErr.guardian_address = "Guardian address is required";
    if (!guardian_info.CNIC && !guardian_info.cnic)
      newErr.guardian_CNIC = "Guardian CNIC is required";

    // Auto-open sections containing errors
    if (Object.keys(newErr).length) {
      const hasPersonal = [
        "img_URL",
        "first_name",
        "last_name",
        "father_name",
        "dob",
        "age",
        "gender",
        "whatsapp_no",
        "CNIC",
        "city",
        "address",
        "alternative_no",
        "email",
        "country",
        "marj_e_taqleed",
        // "doc_img",
      ].some((k) => newErr[k]);
      const hasAcademic = [
        "academic_class",
        "institute_name",
        "inProgress",
        "result",
      ].some((k) => newErr[k]);
      const hasGuardian = [
        "guardian_name",
        "relationship",
        "guardian_email",
        "guardian_whatsapp",
        "guardian_address",
        "guardian_CNIC",
      ].some((k) => newErr[k]);
      const hasBank = ["account_title"].some((k) => newErr[k]);
      if (hasPersonal) setTogglefirst("▾");
      if (hasAcademic) setTogglesecond("▾");
      if (hasGuardian) setTogglefourth("▾");
      if (hasBank) setTogglefifth("▾");
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const uploadImage = async (fileInput, folderName) => {
    if (!fileInput) return null;
    const formData = new FormData();
    formData.append("file", fileInput);
    formData.append("upload_preset", `${CLOUD_NAME}`);
    formData.append("folder", folderName);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${UPLOAD_PRESET}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        if (folderName === "User Pics") {
          setPersonal_info((prev) => ({ ...prev, img_URL: data.secure_url }));
        } else if (folderName === "Doc Pics") {
          setPersonal_info((prev) => ({ ...prev, doc_img: data.secure_url }));
        }
      }
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validateForm();
    if (!ok) {
      setTimeout(() => {
        const order = [
          "img_URL",
          "first_name",
          "last_name",
          "father_name",
          "dob",
          "age",
          "gender",
          "whatsapp_no",
          "CNIC",
          "city",
          "address",
          "alternative_no",
          "email",
          "country",
          "marj_e_taqleed",
          "doc_img",
          "academic_class",
          "institute_name",
          "inProgress",
          "result",
          "guardian_name",
          "relationship",
          "guardian_email",
          "guardian_whatsapp",
          "guardian_address",
          "guardian_CNIC",
          "account_title",
        ];
        const firstKey = order.find((k) => errors[k]);
        if (firstKey) {
          const el = document.querySelector(`[data-field="${firstKey}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            if (el.focus)
              try {
                el.focus();
              } catch (e) {
                console.log("Focus error", e);
              }
          }
        }
      }, 50);
      return;
    }

    try {
      setIsSubmitting(true);

      const profileUrl = await uploadImage(profileFile, "User Pics");
      if (!profileUrl) {
        errors.img_URL = "Profile image is missing";
      }

      const docUrl = await uploadImage(docFile, "Doc Pics");
      if (!docFile) {
        errors.doc_img = "Document image is missing";
      }

      if (!personal_info.img_URL) {
        errors.img_URL = "Profile image is required";
        return;
      }

      if (!personal_info.doc_img) {
        errors.doc_img = "Document image is required";
        return;
      }

      const payload = {
        personal_info: {
          ...personal_info,
          img_URL: profileUrl || personal_info.img_URL,
          doc_img: docUrl || personal_info.doc_img,
          CNIC: personal_info.CNIC || personal_info.cnic,
        },
        academic_progress,
        previous_madrassa,
        bank_details,
        guardian_info: {
          ...guardian_info,
          CNIC: guardian_info.CNIC || guardian_info.cnic,
        },
      };
      // setFormattedData(payload);
      // console.log("Submitting payload:", payload);
      const api = await axios.post(`${BASEURL}/auth/signup`, payload);
      if (api?.data?.status) {
        alert("User successfully registered!");
        localStorage.setItem("token", api.data.data.token);
        navigate("/verify-otp");
      }
    } catch (err) {
      // console.log(err);
      alert(err.response?.data.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const numberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <>
      <a href="/" className="backHome">
        Back To Home
      </a>
      {/* <Link to={"/home"} className="backHome">
        Back To Home
      </Link> */}
      <div className="formDiv">
        <div className="formHeader">
          <img src="/logo.png" alt="" />
          <h1>Welcome to Khuddam Learning Online Classes</h1>
        </div>

        <p className="formNote">All fields are with * are required</p>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className={togglefirst == "▾" ? "PersonalInfo" : "onClose"}>
            <div
              className="toggleBox"
              onClick={() => setTogglefirst(togglefirst === "▾" ? "▸" : "▾")}
            >
              <h2>Personal Information</h2>
              <h2>{togglefirst}</h2>
            </div>
            {togglefirst == "▾" && <hr />}

            {/* IMAGE */}
            <div
              className="formGroup"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              data-field="img_URL"
            >
              <label className="formLabel" style={{ marginBottom: 8 }}>
                Upload Your Profile*
              </label>
              <div
                style={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    fontSize: 14,
                    color: "#666",
                    position: "relative",
                  }}
                >
                  {profileFile ? (
                    <img
                      src={URL.createObjectURL(profileFile)}
                      alt="Profile Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : personal_info.img_URL ? (
                    <img
                      src={
                        typeof personal_info.img_URL === "string"
                          ? personal_info.img_URL
                          : ""
                      }
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>Profile Photo</span>
                  )}
                </div>
                <label
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    background: "#887137",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 12,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  Change
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const allowed = ["image/jpeg", "image/png", "image/jpg"];
                      if (!allowed.includes(file.type)) {
                        setErrors((prev) => ({
                          ...prev,
                          img_URL: "Only JPG / JPEG / PNG images allowed",
                        }));
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        setErrors((prev) => ({
                          ...prev,
                          img_URL: "Max file size 2MB",
                        }));
                        return;
                      }
                      clearError("img_URL");
                      setProfileFile(file);
                      setPersonal_info({
                        ...personal_info,
                        img_URL: URL.createObjectURL(file),
                      });
                    }}
                  />
                </label>
              </div>
              {errors.img_URL && <p className="error">{errors.img_URL}</p>}
            </div>

            <div className="two_side_form">
              <div className="left_align">
                {/* FIRST NAME */}
                <div className="formGroup">
                  <label className="formLabel">First Name*</label>
                  <input
                    type="text"
                    placeholder="Asad"
                    data-field="first_name"
                    className={`formInput ${
                      errors.first_name ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("first_name");
                      setPersonal_info({
                        ...personal_info,
                        first_name: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.first_name && (
                  <p className="error">{errors.first_name}</p>
                )}

                {/* FATHER NAME */}
                <div className="formGroup">
                  <label htmlFor="fatherName" className="formLabel">
                    Father Name*
                  </label>
                  <input
                    placeholder="akber ali"
                    type="text"
                    data-field="father_name"
                    className={`formInput ${
                      errors.father_name ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("father_name");
                      setPersonal_info({
                        ...personal_info,
                        father_name: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.father_name && (
                  <p className="error">{errors.father_name}</p>
                )}

                {/* DOB */}
                <div className="formGroup">
                  <label htmlFor="dob" className="formLabel">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    data-field="dob"
                    className={`formInput ${errors.dob ? "invalid" : ""}`}
                    onChange={(e) => {
                      const v = e.target.value;
                      clearError("dob");
                      clearError("age");
                      setPersonal_info((prev) => ({
                        ...prev,
                        dob: v,
                        age: calculateAge(v),
                      }));
                    }}
                  />
                </div>
                {errors.dob && <p className="error">{errors.dob}</p>}

                {/* Whatsapp no */}
                <div className="formGroup">
                  <label htmlFor="whatsapp_no" className="formLabel">
                    Whatsapp No* <br /> Ex-+92 300XXXXXXX
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      className={`formInput ${
                        errors.whatsapp_no ? "invalid" : ""
                      }`}
                      style={{ flex: "0 0 110px", padding: "0 4px" }}
                      value={whatsappCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setWhatsappCode(code);
                        if (personal_info.whatsapp_no) {
                          const digits = personal_info.whatsapp_no
                            .replace(/^\+?\d+/, "")
                            .replace(/[^0-9]/g, "");
                          setPersonal_info((prev) => ({
                            ...prev,
                            whatsapp_no: code + digits,
                          }));
                        }
                      }}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      data-field="whatsapp_no"
                      className={`formInput ${
                        errors.whatsapp_no ? "invalid" : ""
                      }`}
                      placeholder="XXXXXXXXXX"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, "");
                        clearError("whatsapp_no");
                        setPersonal_info((prev) => ({
                          ...prev,
                          whatsapp_no: whatsappCode + digits,
                        }));
                      }}
                    />
                  </div>
                </div>
                {errors.whatsapp_no && (
                  <p className="error">{errors.whatsapp_no}</p>
                )}

                {/* CNIC */}
                <div className="formGroup">
                  <label htmlFor="cnic" className="formLabel">
                    CNIC / Bay-Form No*
                  </label>
                  <input
                    type="text"
                    data-field="CNIC"
                    placeholder="Ex- 3520212345671"
                    className={`formInput ${errors.CNIC ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("CNIC");
                      setPersonal_info({
                        ...personal_info,
                        CNIC: e.target.value,
                      });
                    }}
                  />
                </div>
                {errors.CNIC && <p className="error">{errors.CNIC}</p>}

                {/* city */}
                <div className="formGroup">
                  <label htmlFor="city" className="formLabel">
                    City*
                  </label>
                  <input
                    type="text"
                    data-field="city"
                    placeholder="Karachi"
                    className={`formInput ${errors.city ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("city");
                      setPersonal_info({
                        ...personal_info,
                        city: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.city && <p className="error">{errors.city}</p>}

                {/* address */}
                <div className="formGroup">
                  <label htmlFor="address" className="formLabel">
                    Address*
                  </label>
                  <input
                    type="text"
                    data-field="address"
                    placeholder="House #, Street #, Area"
                    className={`formInput ${errors.address ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("address");
                      setPersonal_info({
                        ...personal_info,
                        address: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.address && <p className="error">{errors.address}</p>}

                {/* doc_img */}
                <div className="formGroup">
                  <label htmlFor="doc_img" className="formLabel">
                    Any Document Image that verifies your age*
                  </label>
                  <input
                    style={{
                      padding: "10px",
                    }}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    data-field="doc_img"
                    className={`formInput ${errors.doc_img ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("doc_img");
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const allowed = ["image/jpeg", "image/png", "image/jpg"];
                      if (!allowed.includes(file.type)) {
                        setErrors((prev) => ({
                          ...prev,
                          doc_img: "Only image files allowed",
                        }));
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        setErrors((prev) => ({
                          ...prev,
                          doc_img: "Max file size 2MB",
                        }));
                        return;
                      }
                      setDocFile(file);
                      setPersonal_info({
                        ...personal_info,
                        doc_img: file,
                      });
                    }}
                  />
                  {/* Document image preview */}
                  {docFile && (
                    <div>
                      <img
                        src={URL.createObjectURL(docFile)}
                        alt="Document Preview"
                        className="docPreview"
                      />
                    </div>
                  )}
                </div>
                {errors.doc_img && <p className="error">{errors.doc_img}</p>}
              </div>

              <div className="right_align">
                {/* LAST NAME */}
                <div className="formGroup">
                  <label htmlFor="lastName" className="formLabel">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    placeholder="ali"
                    data-field="last_name"
                    className={`formInput ${errors.last_name ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("last_name");
                      setPersonal_info({
                        ...personal_info,
                        last_name: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.last_name && (
                  <p className="error">{errors.last_name}</p>
                )}

                {/* Gender */}
                <div className="formGroup">
                  <label htmlFor="gender" className="formLabel">
                    Gender*
                  </label>
                  <select
                    className={`formInput ${errors.gender ? "invalid" : ""}`}
                    data-field="gender"
                    onChange={(e) => {
                      clearError("gender");
                      setPersonal_info({
                        ...personal_info,
                        gender: e.target.value,
                      });
                    }}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                {errors.gender && <p className="error">{errors.gender}</p>}

                {/* Age */}
                <div className="formGroup">
                  <label htmlFor="age" className="formLabel">
                    Age
                  </label>
                  <input
                    type="number"
                    readOnly
                    className="formInput"
                    value={personal_info.age}
                  />
                </div>
                {errors.age && <p className="error">{errors.age}</p>}

                {/* alternative_no */}
                <div className="formGroup">
                  <label htmlFor="alternative_no" className="formLabel">
                    Alternative No* <br /> Ex-+92 300XXXXXXX
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      className={`formInput ${
                        errors.alternative_no ? "invalid" : ""
                      }`}
                      style={{ flex: "0 0 110px", padding: "0 4px" }}
                      value={alternativeCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setAlternativeCode(code);
                        if (personal_info.alternative_no) {
                          const digits = personal_info.alternative_no
                            .replace(/^\+?\d+/, "")
                            .replace(/[^0-9]/g, "");
                          setPersonal_info((prev) => ({
                            ...prev,
                            alternative_no: code + digits,
                          }));
                        }
                      }}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      data-field="alternative_no"
                      className={`formInput ${
                        errors.alternative_no ? "invalid" : ""
                      }`}
                      placeholder="XXXXXXXXXX"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, "");
                        clearError("alternative_no");
                        setPersonal_info((prev) => ({
                          ...prev,
                          alternative_no: alternativeCode + digits,
                        }));
                      }}
                    />
                  </div>
                </div>
                {errors.alternative_no && (
                  <p className="error">{errors.alternative_no}</p>
                )}

                {/* email */}
                <div className="formGroup">
                  <label htmlFor="email" className="formLabel">
                    Email*
                  </label>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    data-field="email"
                    className={`formInput ${errors.email ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("email");
                      setPersonal_info({
                        ...personal_info,
                        email: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.email && <p className="error">{errors.email}</p>}

                {/* country */}
                <div className="formGroup">
                  <label htmlFor="country" className="formLabel">
                    Country*
                  </label>
                  <input
                    type="text"
                    placeholder="Pakistan"
                    data-field="country"
                    className={`formInput ${errors.country ? "invalid" : ""}`}
                    onChange={(e) => {
                      clearError("country");
                      setPersonal_info({
                        ...personal_info,
                        country: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.country && <p className="error">{errors.country}</p>}

                {/* enrolled_year */}
                <div className="formGroup">
                  <label htmlFor="enrolled_year" className="formLabel">
                    Enrolled Year
                  </label>
                  <input
                    type="text"
                    className="formInput"
                    readOnly
                    value={personal_info.enrolled_year}
                  />
                </div>

                {/* marj_e_taqleed */}
                <div className="formGroup">
                  <label htmlFor="marj_e_taqleed" className="formLabel">
                    marj_e_taqleed*
                  </label>
                  <select
                    className={`formInput ${
                      errors.marj_e_taqleed ? "invalid" : ""
                    }`}
                    data-field="marj_e_taqleed"
                    onChange={(e) => {
                      clearError("marj_e_taqleed");
                      setPersonal_info({
                        ...personal_info,
                        marj_e_taqleed: e.target.value,
                      });
                    }}
                  >
                    <option value="">-- Select marj_e_taqleed --</option>
                    <option value="Ayatullah Sistani">Ayatullah Sistani</option>
                    <option value="Ayatullah Khamenei">
                      Ayatullah Khamenei
                    </option>
                    <option value="Ayatullah Waheed khurasani">
                      Ayatullah Waheed khurasani
                    </option>
                    <option value="Ayatullah Basheer Najafi">
                      Ayatullah Basheer Najafi
                    </option>
                    <option value="Taqleed not started">
                      Taqleed not started
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.marj_e_taqleed && (
                  <p className="error">{errors.marj_e_taqleed}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div
            className={togglesecond == "▾" ? "academic_progress" : "onClose"}
          >
            <div
              className="toggleBox"
              onClick={() => setTogglesecond(togglesecond === "▾" ? "▸" : "▾")}
            >
              <h2>Academic Progress</h2>
              <h2>{togglesecond}</h2>
            </div>
            {togglesecond == "▾" && <hr />}

            <div className="two_side_form">
              <div className="left_align">
                {/* ACADEMIC CLASS */}
                <div className="formGroup">
                  <label className="formLabel">Academic Class*</label>
                  <select
                    data-field="academic_class"
                    className={`formInput ${
                      errors.academic_class ? "invalid" : ""
                    }`}
                    value={academic_progress.academic_class}
                    onChange={(e) => {
                      clearError("academic_class");
                      setAcademic_progress({
                        ...academic_progress,
                        academic_class: e.target.value,
                      });
                    }}
                  >
                    {numberArr.map((num) => (
                      <option key={num} value={`${num}`}>
                        Class {num}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.academic_class && (
                  <p className="error">{errors.academic_class}</p>
                )}

                {/* institute_name */}
                <div className="formGroup">
                  <label className="formLabel">Institute Name*</label>
                  <input
                    type="text"
                    data-field="institute_name"
                    className={`formInput ${
                      errors.institute_name ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("institute_name");
                      setAcademic_progress({
                        ...academic_progress,
                        institute_name: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.academic_class && (
                  <p className="error">{errors.academic_class}</p>
                )}
              </div>
              <div className="right_align">
                {/* inProgress */}
                <div className="formGroup">
                  <label className="formLabel">In Progress*</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "11px 4px",
                    }}
                    className={errors.inProgress ? "invalid" : ""}
                    data-field="inProgress"
                  >
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        name="inProgress"
                        value="yes"
                        checked={academic_progress.inProgress === "yes"}
                        onChange={(e) => {
                          clearError("inProgress");
                          clearError("result");
                          setAcademic_progress({
                            ...academic_progress,
                            inProgress: e.target.value,
                            result: "",
                          });
                        }}
                      />
                      Yes
                    </label>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        name="inProgress"
                        value="no"
                        checked={academic_progress.inProgress === "no"}
                        onChange={(e) => {
                          clearError("inProgress");
                          setAcademic_progress({
                            ...academic_progress,
                            inProgress: e.target.value,
                          });
                        }}
                      />
                      No
                    </label>
                  </div>
                </div>
                {errors.inProgress && (
                  <p className="error">{errors.inProgress}</p>
                )}

                {/* result */}
                <div className="formGroup">
                  <label className="formLabel">
                    Result
                    {academic_progress.inProgress === "no"
                      ? "*"
                      : " (Auto if Yes)"}
                  </label>
                  <select
                    disabled={academic_progress.inProgress === "yes"}
                    data-field="result"
                    className={`formInput ${errors.result ? "invalid" : ""}`}
                    value={academic_progress.result}
                    onChange={(e) => {
                      clearError("result");
                      setAcademic_progress({
                        ...academic_progress,
                        result: e.target.value,
                      });
                    }}
                  >
                    <option value="">-- Select Result --</option>
                    <option value="Above 90%">Above 90%</option>
                    <option value="80%-90%">80% - 90%</option>
                    <option value="70%-80%">70% - 80%</option>
                    <option value="60%-70%">60% - 70%</option>
                    <option value="50%-60%">50% - 60%</option>
                    <option value="Below 50%">Below 50%</option>
                  </select>
                </div>
                {errors.result && <p className="error">{errors.result}</p>}
              </div>
            </div>
          </div>

          {/* Guadian Info */}
          <div className={togglefourth == "▾" ? "guardian_info" : "onClose"}>
            <div
              className="toggleBox"
              onClick={() => setTogglefourth(togglefourth === "▾" ? "▸" : "▾")}
            >
              <h2>Guardian Info</h2>
              <h2>{togglefourth}</h2>
            </div>
            {togglefourth == "▾" && <hr />}

            <div className="two_side_form">
              <div className="left_align">
                {/* name */}
                <div className="formGroup">
                  <label className="formLabel">Guardian Name*</label>
                  <input
                    type="text"
                    data-field="guardian_name"
                    placeholder="john doe"
                    className={`formInput ${
                      errors.guardian_name ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("guardian_name");
                      setGuardian_info({
                        ...guardian_info,
                        name: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.guardian_name && (
                  <p className="error">{errors.guardian_name}</p>
                )}

                {/* email */}
                <div className="formGroup">
                  <label className="formLabel">Guardian Email*</label>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    data-field="guardian_email"
                    className={`formInput ${
                      errors.guardian_email ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("guardian_email");
                      setGuardian_info({
                        ...guardian_info,
                        email: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.guardian_email && (
                  <p className="error">{errors.guardian_email}</p>
                )}

                {/* CNIC */}
                <div className="formGroup">
                  <label className="formLabel">
                    CNIC* <br />Ex- 3520212345671
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    data-field="guardian_CNIC"
                    className={`formInput ${
                      errors.guardian_CNIC ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("guardian_CNIC");
                      setGuardian_info({
                        ...guardian_info,
                        CNIC: e.target.value,
                      });
                    }}
                  />
                </div>
                {errors.guardian_CNIC && (
                  <p className="error">{errors.guardian_CNIC}</p>
                )}
              </div>
              <div className="right_align">
                {/* relationship */}
                <div className="formGroup">
                  <label className="formLabel">Relation with child*</label>
                  <select
                    data-field="relationship"
                    className={`formInput ${
                      errors.relationship ? "invalid" : ""
                    }`}
                    value={guardian_info.relationship}
                    onChange={(e) => {
                      clearError("relationship");
                      setGuardian_info({
                        ...guardian_info,
                        relationship: e.target.value,
                      });
                    }}
                  >
                    <option value="">-- Select Relationship --</option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.relationship && (
                  <p className="error">{errors.relationship}</p>
                )}

                {/* Address */}
                <div className="formGroup">
                  <label className="formLabel">
                    Guardian Address*
                  </label>
                  <input
                    type="text"
                    data-field="guardian_address"
                    placeholder="House #, Street #, Area"
                    className={`formInput ${
                      errors.guardian_address ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("guardian_address");
                      setGuardian_info({
                        ...guardian_info,
                        address: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.guardian_address && (
                  <p className="error">{errors.guardian_address}</p>
                )}

                {/* Whatsapp */}
                <div className="formGroup">
                  <label className="formLabel">
                    Whatsapp No* <br /> Ex-+92 300XXXXXXX
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      className={`formInput ${
                        errors.guardian_whatsapp ? "invalid" : ""
                      }`}
                      style={{ flex: "0 0 110px", padding: "0 4px" }}
                      value={guardianWhatsappCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setGuardianWhatsappCode(code);
                        if (guardian_info.whatsapp_no) {
                          const digits = guardian_info.whatsapp_no
                            .replace(/^[+]?\d+/, "")
                            .replace(/[^0-9]/g, "");
                          setGuardian_info((prev) => ({
                            ...prev,
                            whatsapp_no: code + digits,
                          }));
                        }
                      }}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      data-field="guardian_whatsapp"
                      className={`formInput ${
                        errors.guardian_whatsapp ? "invalid" : ""
                      }`}
                      placeholder="XXXXXXXXXX"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, "");
                        clearError("guardian_whatsapp");
                        setGuardian_info((prev) => ({
                          ...prev,
                          whatsapp_no: guardianWhatsappCode + digits,
                        }));
                      }}
                    />
                  </div>
                </div>
                {errors.guardian_whatsapp && (
                  <p className="error">{errors.guardian_whatsapp}</p>
                )}
              </div>
            </div>
          </div>

          {/* Previous Madrassa */}
          <div className={togglethird == "▾" ? "previous_madrassa" : "onClose"}>
            <div
              className="toggleBox"
              onClick={() => setTogglethird(togglethird === "▾" ? "▸" : "▾")}
            >
              <h2>Previous Madrassa (Optional)</h2>
              <h2>{togglethird}</h2>
            </div>
            {togglethird == "▾" && <hr />}

            <div className="two_side_form">
              <div className="left_align">
                {/* previous madrassa name */}
                <div className="formGroup">
                  <label className="formLabel">Previous Name</label>
                  <input
                    type="text"
                    className="formInput"
                    onChange={(e) =>
                      setPrevious_madrassa({
                        ...previous_madrassa,
                        name: e.target.value.toLowerCase(),
                      })
                    }
                  />
                </div>
              </div>
              <div className="right_align">
                {/* what did you learn */}
                <div className="formGroup">
                  <label className="formLabel">What did you learn there</label>
                  <input
                    type="text"
                    className="formInput"
                    onChange={(e) =>
                      setPrevious_madrassa({
                        ...previous_madrassa,
                        topic: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* bank_details */}
          <div className={togglefifth == "▾" ? "bank_details" : "onClose"}>
            <div
              className="toggleBox"
              onClick={() => setTogglefifth(togglefifth === "▾" ? "▸" : "▾")}
            >
              <h2>Bank Details (Optional)</h2>
              <h2>{togglefifth}</h2>
            </div>
            {togglefifth == "▾" && <hr />}

            <div className="two_side_form">
              <div className="left_align">
                {/* bank name */}
                <div className="formGroup">
                  <label className="formLabel">Bank Name</label>
                  <input
                    type="text"
                    className="formInput"
                    onChange={(e) =>
                      setBank_details({
                        ...bank_details,
                        bank_name: e.target.value.toLowerCase(),
                      })
                    }
                  />
                </div>

                {/* account_title */}
                <div className="formGroup">
                  <label className="formLabel">Account holder name*</label>
                  <input
                    type="text"
                    data-field="account_title"
                    className={`formInput ${
                      errors.account_title ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      clearError("account_title");
                      setBank_details({
                        ...bank_details,
                        account_title: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                </div>
                {errors.account_title && (
                  <p className="error">{errors.account_title}</p>
                )}
              </div>
              <div className="right_align">
                {/* account number */}
                <div className="formGroup">
                  <label className="formLabel">Bank Account Number</label>
                  <input
                    type="text"
                    className="formInput"
                    onChange={(e) =>
                      setBank_details({
                        ...bank_details,
                        account_number: e.target.value,
                      })
                    }
                  />
                </div>

                {/* branch */}
                <div className="formGroup">
                  <label className="formLabel">Bank Branch</label>
                  <input
                    type="text"
                    className="formInput"
                    onChange={(e) =>
                      setBank_details({
                        ...bank_details,
                        branch: e.target.value.toLowerCase(),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <input
            className="submitBtn"
            type="submit"
            value={isSubmitting ? "Uploading..." : "Submit"}
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          />
        </form>
      </div>
    </>
  );
}
