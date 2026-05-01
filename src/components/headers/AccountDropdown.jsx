import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

export default function AccountDropdown() {
  const { isAuthenticated, logout, user, email } = useUserAuth();
  const [isDDOpen, setIsDDOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDDOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    setIsDDOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="link nav-icon-item link-fill">
        <span>
          <svg
            width={26}
            height={26}
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9998 11.5283C5.20222 11.5283 0.485352 16.2452 0.485352 22.0428C0.485352 22.2952 0.69017 22.5 0.942518 22.5C1.19487 22.5 1.39968 22.2952 1.39968 22.0428C1.39968 16.749 5.70606 12.4426 10.9999 12.4426C16.2937 12.4426 20.6001 16.749 20.6001 22.0428C20.6001 22.2952 20.8049 22.5 21.0572 22.5C21.3096 22.5 21.5144 22.2952 21.5144 22.0428C21.5144 16.2443 16.7975 11.5283 10.9998 11.5283Z"
              fill="#333E48"
              stroke="#333E48"
              strokeWidth="0.3"
            />
            <path
              d="M10.9999 0.5C8.22767 0.5 5.97119 2.75557 5.97119 5.52866C5.97119 8.30174 8.22771 10.5573 10.9999 10.5573C13.772 10.5573 16.0285 8.30174 16.0285 5.52866C16.0285 2.75557 13.772 0.5 10.9999 0.5ZM10.9999 9.64303C8.73146 9.64303 6.88548 7.79705 6.88548 5.52866C6.88548 3.26027 8.73146 1.41429 10.9999 1.41429C13.2682 1.41429 15.1142 3.26027 15.1142 5.52866C15.1142 7.79705 13.2682 9.64303 10.9999 9.64303Z"
              fill="#333E48"
              stroke="#333E48"
              strokeWidth="0.3"
            />
          </svg>
        </span>
        <p className="body-small">Sign in</p>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="link nav-icon-item link-fill cursor-pointer"
        onClick={() => setIsDDOpen(!isDDOpen)}
      >
        <span>
          <svg
            width={26}
            height={26}
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9998 11.5283C5.20222 11.5283 0.485352 16.2452 0.485352 22.0428C0.485352 22.2952 0.69017 22.5 0.942518 22.5C1.19487 22.5 1.39968 22.2952 1.39968 22.0428C1.39968 16.749 5.70606 12.4426 10.9999 12.4426C16.2937 12.4426 20.6001 16.749 20.6001 22.0428C20.6001 22.2952 20.8049 22.5 21.0572 22.5C21.3096 22.5 21.5144 22.2952 21.5144 22.0428C21.5144 16.2443 16.7975 11.5283 10.9998 11.5283Z"
              fill="#333E48"
              stroke="#333E48"
              strokeWidth="0.3"
            />
            <path
              d="M10.9999 0.5C8.22767 0.5 5.97119 2.75557 5.97119 5.52866C5.97119 8.30174 8.22771 10.5573 10.9999 10.5573C13.772 10.5573 16.0285 8.30174 16.0285 5.52866C16.0285 2.75557 13.772 0.5 10.9999 0.5ZM10.9999 9.64303C8.73146 9.64303 6.88548 7.79705 6.88548 5.52866C6.88548 3.26027 8.73146 1.41429 10.9999 1.41429C13.2682 1.41429 15.1142 3.26027 15.1142 5.52866C15.1142 7.79705 13.2682 9.64303 10.9999 9.64303Z"
              fill="#333E48"
              stroke="#333E48"
              strokeWidth="0.3"
            />
          </svg>
        </span>
        <p className="body-small">Account</p>
      </div>

      <div
        className={`dropdown-menu ${isDDOpen ? "show" : ""}`}
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          display: isDDOpen ? "block" : "none",
          minWidth: "180px",
          padding: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          zIndex: 1000,
          borderRadius: "8px",
          marginTop: "10px",
          border: "1px solid #eee",
        }}
      >
        <div className="mb-3 pb-2 border-bottom">
          <p className="body-small text-muted mb-0">Logged in as:</p>
          <p className="body-md-2 fw-semibold text-truncate mb-0" title={email} style={{ color: "#333E48" }}>
            {email}
          </p>
        </div>
        <button
          className="dropdown-item w-100 text-start border-0 bg-transparent py-2 px-0 d-flex align-items-center gap-2 transition-all hover-opacity"
          onClick={handleLogout}
          style={{ 
            color: "#ff4d4f",
            cursor: "pointer"
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="fw-semibold">Sign out</span>
        </button>
      </div>
    </div>
  );
}
