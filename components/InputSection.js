import React, { useState } from 'react';

const InputSection = ({ onSubmit, isLoading, previousSearches }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Auto-submit when input length reaches 10 digits
    if (value.length === 10) {
      onSubmit(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handleSuggestionClick = (number) => {
    setInputValue(number);
    onSubmit(number);
  };

  return (
    <div className="input-section">
      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="tel"
          placeholder="Enter parent's mobile number"
          value={inputValue}
          onChange={handleChange}
          disabled={isLoading}
          autoFocus
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <button type="submit" disabled={isLoading || !inputValue}>
          Get Attendance
        </button>
      </form>
      
      {previousSearches && previousSearches.length > 0 && (
        <div className="suggestions-container">
          <div className="suggestions-header">
            <span className="suggestions-title">Suggestions</span>
          </div>
          <div className="suggestions-list">
            {previousSearches.map((number, index) => (
              <button 
                key={index} 
                className="suggestion-item" 
                onClick={() => handleSuggestionClick(number)}
              >
                <i className="fas fa-history suggestion-icon"></i>
                <span className="suggestion-text">{number}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSection;
