import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EmployeeProfile = ({ isModal = false, onClose }) => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    employeeId: "",
  });

  const themeColors = {
    primary: "#1b4d8d",
    secondary: "#206c95",
  };

  // ✅ Load employee info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const employeeId = localStorage.getItem("employeeId");

    const email = token ? parseJwt(token)?.sub || "" : "";

    setEmployeeData({
      name: name || "Unknown",
      email: email || "Not available",
      employeeId: employeeId || "N/A",
    });
  }, []);

  // ✅ Decode JWT safely (no external lib)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`h-100 ${
        isModal
          ? "position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center p-3"
          : "container my-4"
      }`}
      style={isModal ? { zIndex: 1050 } : {}}
    >
      <div
        className="card border-0 shadow-sm"
        style={{ width: isModal ? "400px" : "100%", maxWidth: "600px" }}
      >
        {/* Header */}
        <div
          className="card-header text-white border-0 py-3"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-person-circle"></i> My Profile
            </h4>
            {isModal && (
              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            )}
          </div>
          <p className="mb-0 opacity-75 small">View your personal information</p>
        </div>

        {/* Body */}
        <div className="card-body p-4">
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`alert alert-${
                  message.type === "success" ? "success" : "danger"
                } d-flex align-items-center mb-4`}
              >
                <i
                  className={`bi ${
                    message.type === "success"
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-triangle-fill"
                  } me-2`}
                ></i>
                <span className="flex-grow-1">{message.text}</span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage({ type: "", text: "" })}
                ></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Avatar Placeholder */}
          <div className="text-center mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-circle d-inline-flex justify-content-center align-items-center shadow"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: `${themeColors.primary}15`,
                border: `4px solid ${themeColors.primary}30`,
              }}
            >
              <i
                className="bi bi-person"
                style={{ fontSize: "60px", color: themeColors.primary }}
              ></i>
            </motion.div>
          </div>

          {/* Profile Fields */}
          <div className="row g-3">
            <div className="col-12">
              <label
                className="form-label fw-semibold"
                style={{ color: themeColors.primary }}
              >
                <i className="bi bi-person me-2"></i>Full Name
              </label>
              <input
                type="text"
                className="form-control"
                value={employeeData.name}
                disabled
              />
            </div>

            <div className="col-12">
              <label
                className="form-label fw-semibold"
                style={{ color: themeColors.primary }}
              >
                <i className="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                className="form-control"
                value={employeeData.email}
                disabled
              />
            </div>

            <div className="col-12">
              <label
                className="form-label fw-semibold"
                style={{ color: themeColors.primary }}
              >
                <i className="bi bi-person-badge me-2"></i>Employee ID
              </label>
              <input
                type="text"
                className="form-control"
                value={employeeData.employeeId}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Input focus effect */}
      <style jsx>{`
        .form-control:focus {
          border-color: ${themeColors.primary};
          box-shadow: 0 0 0 0.2rem ${themeColors.primary}25;
        }
      `}</style>
    </motion.div>
  );
};

export default EmployeeProfile;
