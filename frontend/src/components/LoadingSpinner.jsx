import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-wrapper">
      <div className="plant-spinner">
        {/* Outer rotating ring */}
        <div className="ring ring-outer"></div>
        <div className="ring ring-middle"></div>
        {/* Center leaf icon */}
        <div className="leaf-center">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6 2 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 2 12 2Z"
              fill="url(#leafGradient)"
              opacity="0.15"
            />
            <path
              d="M12 21C12 21 7 16 7 11C7 7.686 9.686 5 13 5C13 5 18 5 18 10C18 14 14 18 12 21Z"
              fill="url(#leafGradient)"
            />
            <path
              d="M12 21L12 11"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M12 14C12 14 10 12 9 11"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M12 17C12 17 14 15 15 14"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="leafGradient" x1="9" y1="5" x2="16" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Orbiting dots */}
        <div className="orbit-dot dot-1"></div>
        <div className="orbit-dot dot-2"></div>
        <div className="orbit-dot dot-3"></div>
      </div>

      <div className="spinner-text-group">
        <p className="spinner-message">{message}</p>
        <div className="spinner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
