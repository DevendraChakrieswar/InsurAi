import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EmployeeRegister() {
  const [employeeId, setEmployeeId] = useState(""); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!employeeId || !name || !email || !password) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          employeeId: employeeId.trim(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password 
        }), 
      });

      let responseData;
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        const text = await res.text();
        responseData = { message: text };
      }

      if (res.ok) {
        setMessage("Registration successful! Redirecting to login...");
        
        // Store employee info in localStorage
        localStorage.setItem("employeeId", employeeId);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }

        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/employee/login");
        }, 2000);
      } else {
        // Handle 400 Bad Request and other errors
        if (res.status === 400) {
          if (responseData.message && responseData.message.toLowerCase().includes("employee")) {
            setMessage("Employee ID already exists. Please use a different ID.");
          } else if (responseData.message && responseData.message.toLowerCase().includes("email")) {
            setMessage("Email address already registered. Please use a different email.");
          } else {
            setMessage(responseData.message || "Invalid registration data. Please check your information.");
          }
        } else {
          setMessage(responseData.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #1b262c 0%, #143240 50%, #206c95 100%)",
        padding: "0",
        margin: "0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "1000px",
          width: "95%",
          borderRadius: "20px",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="row g-0">
          {/* Left Side - Image & Content */}
          <div 
            className="col-md-6 d-none d-md-flex"
            style={{
              background: "linear-gradient(135deg, #1b262c 0%, #206c95 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="p-5 d-flex flex-column justify-content-between text-white">
              {/* Header */}
              <div>
                <div className="d-flex align-items-center mb-4">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-0 ms-3">InsurAI</h4>
                </div>

                <h2 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
                  Join Our <br />
                  <span style={{ color: "#4ecdc4" }}>AI-Powered</span> Insurance Platform
                </h2>
                <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Transform your insurance experience with cutting-edge artificial intelligence and secure enterprise solutions.
                </p>
              </div>

              {/* Features List */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(78, 205, 196, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>AI-Powered Risk Assessment</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(78, 205, 196, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Enterprise-Grade Security</span>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(78, 205, 196, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Collaborative Team Features</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px" }}>
                <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                  Trusted by 10,000+ insurance professionals worldwide
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "10%",
                width: "100px",
                height: "100px",
                background: "radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "5%",
                width: "60px",
                height: "60px",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Right Side - Form */}
          <div className="col-md-6">
            <div className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #206c95, #1b262c)",
                    borderRadius: "16px",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 25px rgba(32, 108, 149, 0.3)",
                    color: "white",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <h3 className="fw-bold" style={{ color: "#1b262c" }}>Create Account</h3>
                <p className="text-muted mb-0">Join InsurAI and start your journey</p>
              </div>

              {/* Alert Messages */}
              {message && (
                <div
                  className={`alert ${
                    message.includes("successful") ? "alert-success" : "alert-danger"
                  } d-flex align-items-center`}
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "0.9rem",
                    padding: "12px 16px",
                    marginBottom: "20px",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="me-2"
                  >
                    {message.includes("successful") ? (
                      <>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                      </>
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </>
                    )}
                  </svg>
                  {message}
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#1b262c", fontSize: "0.9rem" }}>
                    Employee ID
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                      placeholder="Enter your corporate employee ID"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#206c95";
                        e.target.style.boxShadow = "0 0 0 3px rgba(32, 108, 149, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="position-absolute"
                      style={{
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: "#206c95",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#1b262c", fontSize: "0.9rem" }}>
                    Full Name
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#206c95";
                        e.target.style.boxShadow = "0 0 0 3px rgba(32, 108, 149, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="position-absolute"
                      style={{
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: "#206c95",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#1b262c", fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#206c95";
                        e.target.style.boxShadow = "0 0 0 3px rgba(32, 108, 149, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="position-absolute"
                      style={{
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: "#206c95",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#1b262c", fontSize: "0.9rem" }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a strong password (min. 6 characters)"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 44px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#206c95";
                        e.target.style.boxShadow = "0 0 0 3px rgba(32, 108, 149, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="position-absolute"
                      style={{
                        top: "50%",
                        left: "16px",
                        transform: "translateY(-50%)",
                        color: "#206c95",
                        opacity: 0.6,
                      }}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <button
                      type="button"
                      className="btn btn-link position-absolute p-0 border-0"
                      style={{
                        top: "50%",
                        right: "16px",
                        transform: "translateY(-50%)",
                        color: "#206c95",
                        background: "none",
                        opacity: 0.6,
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold position-relative"
                  disabled={loading}
                  style={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #206c95, #1b262c)",
                    border: "none",
                    color: "white",
                    padding: "14px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(32, 108, 149, 0.3)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(32, 108, 149, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(32, 108, 149, 0.3)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  Already have an account?
                </p>
                <Link
                  to="/employee/login"
                  className="fw-semibold text-decoration-none"
                  style={{
                    color: "#206c95",
                    fontSize: "0.9rem",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#1b262c";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#206c95";
                  }}
                >
                  Sign In to Your Account
                </Link>
              </div>

              {/* Security Badge */}
              <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #e0e0e0" }}>
                <div className="d-flex align-items-center justify-content-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="me-2"
                    style={{ color: "#206c95" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <small style={{ color: "#666", fontSize: "0.8rem" }}>
                    Enterprise Security • GDPR Compliant
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}