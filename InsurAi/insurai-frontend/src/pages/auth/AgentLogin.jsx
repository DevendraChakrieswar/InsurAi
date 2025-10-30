import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AgentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorEmail("");
    setErrorPassword("");

    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store JWT token and agent details
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", "AGENT");
        localStorage.setItem("agentId", data.agentId);
        localStorage.setItem("agentName", data.name);

        console.log("Token stored in localStorage:", data.token);
        navigate("/agent/dashboard");
      } else {
        const text = await response.text();
        let serverError = text;

        try {
          const parsed = JSON.parse(text);
          if (parsed?.email) setErrorEmail(parsed.email);
          if (parsed?.password) setErrorPassword(parsed.password);
          serverError = parsed?.message || parsed || text;
        } catch (err) {
          serverError = text || "Something went wrong. Please try again.";
        }

        if (!errorEmail && !errorPassword) {
          if (response.status === 401) setErrorPassword("Invalid password.");
          else if (response.status === 404) setErrorEmail("Agent not found.");
          else setErrorPassword(serverError);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorPassword("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #010f0c 0%, #087f5b 100%)",
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
          {/* Left Side - Branding & Content */}
          <div 
            className="col-md-6 d-none d-md-flex"
            style={{
              background: "linear-gradient(135deg, #010f0c 0%, #087f5b 100%)",
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
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h4 className="fw-bold mb-0 ms-3">InsurAI Agents</h4>
                </div>

                <h2 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
                  Agent <br />
                  <span style={{ color: "#20c997" }}>Portal</span> Access
                </h2>
                <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Access your dedicated agent dashboard to manage policies, clients, and commissions with AI-powered insights.
                </p>
              </div>

              {/* Features List */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(32, 201, 151, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Client Management Tools</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(32, 201, 151, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Commission Tracking</span>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(32, 201, 151, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Policy Analytics</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px" }}>
                <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                  Trusted by 5,000+ insurance agents nationwide
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
                background: "radial-gradient(circle, rgba(32, 201, 151, 0.3) 0%, transparent 70%)",
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
                    background: "linear-gradient(135deg, #087f5b, #010f0c)",
                    borderRadius: "16px",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 25px rgba(8, 127, 91, 0.3)",
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
                <h3 className="fw-bold" style={{ color: "#010f0c" }}>Agent Login</h3>
                <p className="text-muted mb-0">Access your agent dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} autoComplete="on">
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#010f0c", fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      id="agent-email"
                      name="username"
                      autoComplete="username"
                      className={`form-control ${errorEmail ? "is-invalid" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="agent@example.com"
                      style={{
                        borderRadius: "10px",
                        border: `1px solid ${errorEmail ? "#dc3545" : "#e0e0e0"}`,
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#087f5b";
                        e.target.style.boxShadow = "0 0 0 3px rgba(8, 127, 91, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errorEmail ? "#dc3545" : "#e0e0e0";
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
                        color: errorEmail ? "#dc3545" : "#087f5b",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  {errorEmail && (
                    <div className="d-flex align-items-center mt-2" style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errorEmail}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#010f0c", fontSize: "0.9rem" }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="agent-password"
                      name="password"
                      autoComplete="current-password"
                      className={`form-control ${errorPassword ? "is-invalid" : ""}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        borderRadius: "10px",
                        border: `1px solid ${errorPassword ? "#dc3545" : "#e0e0e0"}`,
                        padding: "12px 44px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#087f5b";
                        e.target.style.boxShadow = "0 0 0 3px rgba(8, 127, 91, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errorPassword ? "#dc3545" : "#e0e0e0";
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
                        color: errorPassword ? "#dc3545" : "#087f5b",
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
                        color: errorPassword ? "#dc3545" : "#087f5b",
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
                  {errorPassword && (
                    <div className="d-flex align-items-center mt-2" style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errorPassword}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold position-relative"
                  disabled={loading}
                  style={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #087f5b, #010f0c)",
                    border: "none",
                    color: "white",
                    padding: "14px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(8, 127, 91, 0.3)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(8, 127, 91, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(8, 127, 91, 0.3)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing In...
                    </>
                  ) : (
                    "Access Agent Dashboard"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  Need agent assistance?
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="/agent/register"
                    className="fw-semibold text-decoration-none me-3"
                    style={{
                      color: "#087f5b",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#010f0c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#087f5b";
                    }}
                  >
                    Register New Agent
                  </Link>
                  <span style={{ color: "#ccc" }}>|</span>
                  <button
                    className="btn btn-link fw-semibold text-decoration-none p-0 border-0 ms-3"
                    style={{
                      color: "#087f5b",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#010f0c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#087f5b";
                    }}
                  >
                    Contact Admin
                  </button>
                </div>
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
                    style={{ color: "#087f5b" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <small style={{ color: "#666", fontSize: "0.8rem" }}>
                    Secure Agent Portal • Commission Protected
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