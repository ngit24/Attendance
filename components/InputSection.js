import React, { useState, useEffect } from "react";

export default function InputSection({ onSubmit, isLoading }) {
  const [number, setNumber] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNumber(value);
    
    // Auto-submit when reaching 10 digits
    if (value.length === 10) {
      onSubmit(value);
    }
  };

  const handleClick = () => {
    if (number.length === 10) {
      onSubmit(number);
    }
  };

  return (
    <div className="input-section">
      <div className="attendance-form">
        <input
          type="tel"
          value={number}
          onChange={handleChange}
          placeholder="Enter Parent's Number"
          maxLength="10"
          required
          disabled={isLoading}
        />
        <button 
          type="button"
          onClick={handleClick}
          disabled={number.length !== 10 || isLoading}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <i className="fas fa-search"></i> 
              Get Attendance
            </>
          )}
        </button>
      </div>
      <div className="additional-buttons">
        <a href="https://ngit24.me/cie.html" className="button cie-button">
          <i className="fas fa-chart-line"></i>Check Your CIE Marks
        </a>
        <a href="https://ngit24.github.io/pyq/" className="button pyqs-button">
          <i className="fas fa-book"></i>Get PYQS
        </a>
      </div>
    </div>
  );
}
