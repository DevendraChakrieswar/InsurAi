import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("name", data.name);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
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
        background: "linear-gradient(135deg, #2b0938 0%, #8b0086 100%)",
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
              background: "linear-gradient(135deg, #2b0938 0%, #8b0086 100%)",
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
                  <h4 className="fw-bold mb-0 ms-3">InsurAI Admin</h4>
                </div>

                <h2 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
                  System <br />
                  <span style={{ color: "#e6b8e3" }}>Administrator</span> Portal
                </h2>
                <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Access the comprehensive admin dashboard to manage users, monitor system performance, and configure enterprise settings.
                </p>
              </div>

              {/* Features List */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(230, 184, 227, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6b8e3" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>User Management & Permissions</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(230, 184, 227, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6b8e3" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                      <polyline points="7.5 19.79 7.5 14.6 3 12" />
                      <polyline points="21 12 16.5 14.6 16.5 19.79" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>System Configuration</span>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(230, 184, 227, 0.2)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6b8e3" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "1rem" }}>Advanced Analytics & Reports</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px" }}>
                <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                  Enterprise-grade security and monitoring
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
                background: "radial-gradient(circle, rgba(230, 184, 227, 0.3) 0%, transparent 70%)",
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
                    background: "linear-gradient(135deg, #8b0086, #2b0938)",
                    borderRadius: "16px",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 25px rgba(139, 0, 134, 0.3)",
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
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="fw-bold" style={{ color: "#2b0938" }}>Admin Login</h3>
                <p className="text-muted mb-0">Enter your credentials to access the dashboard</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div 
                  className="alert alert-danger d-flex align-items-center"
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    background: "rgba(220, 53, 69, 0.1)",
                    color: "#dc3545",
                    fontSize: "0.9rem",
                    padding: "12px 16px",
                    marginBottom: "20px"
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} autoComplete="on">
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#2b0938", fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      id="admin-email"
                      name="username"
                      autoComplete="username"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@insurai.com"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8b0086";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 0, 134, 0.1)";
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
                        color: "#8b0086",
                        opacity: 0.6,
                      }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#2b0938", fontSize: "0.9rem" }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin-password"
                      name="password"
                      autoComplete="current-password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: "12px 44px 12px 44px",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8b0086";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 0, 134, 0.1)";
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
                        color: "#8b0086",
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
                        color: "#8b0086",
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
                    background: "linear-gradient(135deg, #8b0086, #2b0938)",
                    border: "none",
                    color: "white",
                    padding: "14px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(139, 0, 134, 0.3)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(139, 0, 134, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(139, 0, 134, 0.3)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing In...
                    </>
                  ) : (
                    "Access Admin Dashboard"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  System administrator access only
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-link fw-semibold text-decoration-none p-0 border-0 me-3"
                    style={{
                      color: "#8b0086",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2b0938";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#8b0086";
                    }}
                  >
                    Forgot Password?
                  </button>
                  <span style={{ color: "#ccc" }}>|</span>
                  <button
                    className="btn btn-link fw-semibold text-decoration-none p-0 border-0 ms-3"
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2b0938";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#666";
                    }}
                    onClick={() => navigate("/")}
                  >
                    ← Back to Portal
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
                    style={{ color: "#8b0086" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <small style={{ color: "#666", fontSize: "0.8rem" }}>
                    Secure Admin Access • JWT Protected
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