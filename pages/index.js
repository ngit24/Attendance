import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import '../pages/_app.js'; // Assuming global styles, keep if needed
import AttendanceData from '../components/AttendanceData';
import InputSection from '../components/InputSection';
// Import our new styles

export default function Home() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup state for errors
  const [transitionState, setTransitionState] = useState('initial');

  useEffect(() => {
    // Create stars dynamically
    createStars();
    
    // Clean up on unmount
    return () => {
      const starsContainer = document.querySelector('.stars');
      if (starsContainer) {
        document.body.removeChild(starsContainer);
      }
    };
  }, []);

  const sendAnalytics = (number) => {
    try {
      fetch(`https://sanjaya-netra.89determined.workers.dev/?mobile_number=${number}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
     
      });
    } catch (error) {
     
    }
  };

  const handleSubmit = async (number) => {
    // Check if number is valid before fetching
    if (!number || typeof number !== 'string' || number.trim() === '') {
      setShowPopup(true);
      return;
    }

    setIsLoading(true);
    setTransitionState('loading');

    // Send analytics in the background without waiting
    sendAnalytics(number);

    try {
      const response = await fetch(`https://test.89determined.workers.dev/?mobile_number=${number}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data'); // Network or HTTP error
      }
      
      const data = await response.json();
      
      
      // Check if data is valid before setting state
      if (data && Object.keys(data).length > 0) {
        setTransitionState('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        setAttendanceData(data);
        setTransitionState('fade-in');
      } else {
        throw new Error('Invalid response from server'); // Empty or malformed data
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      setShowPopup(true); // Show popup for any error
      setTransitionState('initial');
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const createStars = () => {
    const existingStars = document.querySelector('.stars');
    if (existingStars) {
      document.body.removeChild(existingStars);
    }

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.opacity = Math.random() * 0.7 + 0.3;
      star.style.animationDelay = `${Math.random() * 4}s`;
      starsContainer.appendChild(star);
    }

    for (let i = 0; i < 3; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.left = `${Math.random() * 70 + 15}%`;
      shootingStar.style.top = `${Math.random() * 50 + 5}%`;
      shootingStar.style.animationDelay = `${Math.random() * 10}s`;
      starsContainer.appendChild(shootingStar);
    }

    document.body.appendChild(starsContainer);
  };

  // Simple text-based loader
  const SimpleLoader = () => (
    <div className="simple-loader">
      <p>Getting attendance data...</p>
    </div>
  );

  // Completely redesigned Popup component
  const PortalPopup = ({ message, onClose }) => (
    <div className="portal-popup-overlay" onClick={onClose}>
      <div className="portal-popup" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <button className="portal-popup-close-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>NGIT Student Portal</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <div className="page-container">
        <div className={`dashboard transition-${transitionState}`}>
          {isLoading ? (
            <SimpleLoader /> // Simple text-based loader
          ) : !attendanceData ? (
            <>
              <Header />
              <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
            </>
          ) : (
            <AttendanceData data={attendanceData} />
          )}
          
          {showPopup && (
            <PortalPopup 
              message="Incorrect number, try again with your parents' number." 
              onClose={closePopup}
            />
          )}
        </div>
        
        {/* Only show projects and social text when not displaying attendance data */}
        {!attendanceData && (
          <>
            <div className="projects-showcase">
              <h3>Check Out My Other Projects</h3>
              <div className="projects-container">
                <a href="https://ngit24.github.io/bday/" target="_blank" rel="noopener noreferrer" className="project-card">
                  <div className="project-icon">
                    <i className="fas fa-birthday-cake"></i>
                  </div>
                  <div className="project-details">
                    <h4>Birthday Calendar</h4>
                    <p>Track birthdays of our college mates</p>
                  </div>
                  <div className="project-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </a>
              </div>
            </div>

            <a 
              href="https://instagram.com/vardn.19" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" 
                  fill="#E4405F" />
              </svg>
              Follow me on Instagram <span className="emoji-bounce"></span>
            </a>
          </>
        )}

        <footer className="text-center py-4 text-gray-600">
          <div className="footer-content">
            <p>
              Designed by <span className="font-semibold text-orange-600">Vardan</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
