import React, { useState } from 'react';

const ScamWarningPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500); // Increased animation duration for smoother transition
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`scam-warning-overlay ${isVisible ? 'visible' : 'hiding'}`} onClick={handleOverlayClick}>
      <div className="scam-warning-popup">
        <div className="popup-decoration top"></div>
        <div className="popup-decoration bottom"></div>
        
        <div className="scam-warning-content">
          <div className="warning-text">
            <h2>Important Notice</h2>
            <div className="divider"></div>
            <p>
              Be cautious of fake <span className="highlight-word primary">internship</span> and <span className="highlight-word primary">scholarship</span> offers. If someone asks for <span className="highlight-word danger">payment</span>, it's likely a <span className="highlight-word danger">scam</span>. Always verify with college officials <span className="highlight-word secondary"></span>.
            </p>
            
            <div className="scam-tips">
              <div className="tip-text">
              </div>
              <div className="tip-text" style={{marginTop: "10px"}}>
                <strong>Pro Tip:</strong> If you really want an internship, wait until 4th semester. Our college will provide opportunities for projects and internships.
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="scam-warning-button primary" onClick={handleClose}>
              Understood
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scam-warning-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 1;
          transition: opacity 0.5s ease;
          padding: 20px;
        }
        
        .scam-warning-overlay.hiding {
          opacity: 0;
        }

        .scam-warning-popup {
          background: var(--card-bg, #ffffff);
          border-radius: var(--border-radius, 8px);
          padding: 0;
          max-width: 95%;
          width: 450px;
          box-shadow: var(--shadow, 0 5px 15px rgba(0, 0, 0, 0.08)), 
                      0 15px 35px rgba(58, 123, 213, 0.2);
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          overflow: hidden;
          position: relative;
        }
        
        .popup-decoration {
          position: absolute;
          height: 6px;
          background: var(--primary-gradient, linear-gradient(135deg, #3a7bd5, #00d2ff));
          width: 100%;
          z-index: 2;
        }
        
        .popup-decoration.top {
          top: 0;
        }
        
        .popup-decoration.bottom {
          bottom: 0;
        }
        
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .scam-warning-content {
          padding: 30px;
          position: relative;
          z-index: 1;
        }

        .warning-text {
          text-align: center;
          margin-bottom: 25px;
        }

        h2 {
          margin: 0;
          color: var(--text-primary, #333333);
          font-family: 'Poppins', 'Quicksand', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .divider {
          width: 60px;
          height: 3px;
          background: var(--primary-gradient, linear-gradient(135deg, #3a7bd5, #00d2ff));
          margin: 12px auto 15px;
          border-radius: 2px;
        }

        p {
          color: var(--text-primary, #333333);
          font-family: 'Poppins', 'Quicksand', sans-serif;
          margin: 0 0 20px;
          font-size: 16px;
          line-height: 1.7;
          letter-spacing: 0.2px;
        }

        .scam-tips {
          display: flex;
          align-items: flex-start;
          background: var(--secondary-gradient, linear-gradient(135deg, #f5f7fa, #c3cfe2));
          border-radius: var(--border-radius, 8px);
          padding: 15px;
          margin: 5px 0 0;
          text-align: left;
        }
        
        .tip-text {
          color: var(--text-primary, #333333);
          font-family: var(--body-font, 'Quicksand', sans-serif);
          font-size: 12px; /* Reduced from 15px to make it very small */
          line-height: 1.4;
        }
        
        .tip-text strong {
          font-size: 13px; /* Making the "Pro Tip:" slightly larger than the rest */
          font-weight: 700;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 25px;
        }

        .scam-warning-button {
          padding: 12px 36px;
          font-family: 'Poppins', 'Quicksand', sans-serif;
          font-size: 16px;
          font-weight: 700;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          letter-spacing: 0.5px;
        }

        .scam-warning-button.primary {
          background: var(--primary-gradient, linear-gradient(135deg, #3a7bd5, #00d2ff));
          color: white;
        }

        .scam-warning-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(58, 123, 213, 0.2);
        }
        
        .scam-warning-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(58, 123, 213, 0.1);
        }
        
        .highlight-word {
          font-weight: 700;
          position: relative;
          display: inline-block;
          color: #3a7bd5; /* Unified light blue color for all highlighted words */
          text-shadow: 0 0 1px rgba(58, 123, 213, 0.2);
        }
        
        .highlight-word.primary,
        .highlight-word.danger,
        .highlight-word.secondary {
          background: none;
          -webkit-background-clip: initial;
          background-clip: initial;
          -webkit-text-fill-color: initial;
          color: #3a7bd5; /* Consistent light blue color */
        }
        
        .highlight-word::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background: #3a7bd5; /* Unified underline color */
        }
        
        /* Remove different underline colors */
        .highlight-word.primary::after,
        .highlight-word.danger::after,
        .highlight-word.secondary::after {
          background: #3a7bd5; /* Consistent light blue underline */
        }
        
        @media (prefers-color-scheme: dark) {
          .scam-warning-popup {
            background: var(--card-bg, #2a2a2a);
          }
          
          h2, p, .tip-text {
            color: var(--text-primary, #ffffff);
          }
          
          .scam-tips {
            background: rgba(58, 123, 213, 0.15);
          }
          
          /* Updated for dark mode */
          .highlight-word,
          .highlight-word.primary,
          .highlight-word.danger,
          .highlight-word.secondary {
            color: #5a97f0; /* Lighter blue for dark mode */
            text-shadow: 0 0 2px rgba(90, 151, 240, 0.3);
          }
          
          .highlight-word::after,
          .highlight-word.primary::after,
          .highlight-word.danger::after,
          .highlight-word.secondary::after {
            background: #5a97f0; /* Lighter blue underline for dark mode */
            opacity: 0.7;
          }
        }
        
        /* Mobile responsive adjustments */
        @media screen and (max-width: 480px) {
          .scam-warning-popup {
            width: 100%;
          }
          
          h2 {
            font-size: 20px;
          }
          
          .scam-warning-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ScamWarningPopup;
