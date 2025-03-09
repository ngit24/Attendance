import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import '../pages/_app.js'; // Assuming global styles, keep if needed
import AttendanceData from '../components/AttendanceData';
import InputSection from '../components/InputSection';

export default function Home() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [transitionState, setTransitionState] = useState('initial');
  const [previousSearches, setPreviousSearches] = useState([]); // Initialize as empty array
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showBookmark, setShowBookmark] = useState(true);

  // Load previous searches from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      const storedSearches = localStorage.getItem('previousSearches');
      setPreviousSearches(storedSearches ? JSON.parse(storedSearches) : []);
    }
  }, []); // Empty dependency array: runs once on mount

  // Save to localStorage whenever previousSearches changes
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    }
  }, [previousSearches]);

  useEffect(() => {
    createStars();
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
      }).catch(() => {});
    } catch (error) {}
  };

  const handleSubmit = async (number) => {
    if (!number || typeof number !== 'string' || number.trim() === '') {
      setShowPopup(true);
      return;
    }

    setIsLoading(true);
    setTransitionState('loading');

    sendAnalytics(number);

    try {
      const response = await fetch(`https://test.89determined.workers.dev/?mobile_number=${number}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
        setTransitionState('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        setAttendanceData(data);
        setTransitionState('fade-in');
        setPreviousSearches(prev => {
          if (prev.includes(number)) return prev;
          const updatedSearches = [number, ...prev].slice(0, 5); // Limit to 5 entries
          return updatedSearches;
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      setShowPopup(true);
      setTransitionState('initial');
    } finally {
      setIsLoading(false);
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

  const AttendanceLoader = () => {
    return (
      <div className="attendance-loader-container">
        <div className="attendance-loader">
          <div className="loader-section">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
          </div>
          <p className="loader-text">Fetching your attendance...</p>
        </div>
      </div>
    );
  };

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

  // Add this function to handle bookmark
  const handleBookmark = (e) => {
    e.preventDefault();
    if (window.sidebar && window.sidebar.addPanel) { // Firefox
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE
      window.external.AddFavorite(window.location.href, document.title);
    } else { // Chrome, Safari, etc.
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
    setShowBookmark(false);
    localStorage.setItem('bookmarkShown', 'true');
  };

  // Check if bookmark prompt was shown before
  useEffect(() => {
    if (localStorage.getItem('bookmarkShown')) {
      setShowBookmark(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>NGIT Student Tracker</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <div className="page-container">
        <div className={`dashboard transition-${transitionState}`}>
          {isLoading ? (
            <AttendanceLoader />
          ) : !attendanceData ? (
            <>
              <Header />
              <InputSection 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                previousSearches={previousSearches}
              />
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

        

        {!attendanceData && (
          <>
            {/* CIE and PYQ buttons outside of attendance form container */}
            <div className="extra-buttons-section">
              <button 
                className="extra-button" 
                onClick={() => window.open('/test.html', '_blank')}
              >
                <i className="fas fa-clipboard-list"></i> CIE Marks
              </button>
              <button 
                className="extra-button"
                onClick={() => window.open('https://ngit24.github.io/pyq/', '_blank')}
              >
                <i className="fas fa-file-alt"></i> PYQ's
              </button>
            </div>
            
            <a 
              href="https://instagram.com/vardn.19" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-text"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" 
                  fill="#FFFFFF" />
              </svg>
              Interested in collaboration? DM me
            </a>
            
            <div className="projects-showcase">
              <h3>Useful Links</h3>
              <div className="projects-classic">
                {/* Change Link to use onClick with router.push for better handling */}
                <div 
                  onClick={() => window.location.href = '/birthday'} 
                  className="project-card animated-border"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-status live">
                    <span className="live-dot"></span> LIVE NOW
                  </div>
                  <div className="project-icon">
                    <i className="fas fa-cake-candles"></i>
                  </div>
                  <div className="project-info">
                    <h4>Birthday's Calendar</h4>
                    <p>Never miss your class mates' birthdays!</p>
                  </div>
                  <div className="project-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
                
                <Link href="/academic-calendar" className="project-card">
                  <div className="project-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="project-info">
                    <h4>Academic Calendar</h4>
                    <p>View semester schedules, events and important dates</p>
                  </div>
                  <div className="project-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </Link>

                <div 
                  onClick={() => setShowComingSoon(true)} 
                  className="project-card" 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="project-info">
                    <h4>Student Community</h4>
                    <p>Connect with your classmates and seniors</p>
                  </div>
                  <div className="project-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {showComingSoon && (
          <div className="coming-soon-overlay" onClick={() => setShowComingSoon(false)}>
            <div className="coming-soon-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>Coming Soon!</h3>
              <p>We're developing the Student Community platform to centralize everything college-related. Stay tuned for updates!</p>
              <button onClick={() => setShowComingSoon(false)}>Got it!</button>
            </div>
          </div>
        )}

        <footer className="text-center py-4 text-gray-600">
          <div className="footer-content">
            <p>
              Designed by <span className="font-semibold" style={{ color: 'var(--accent)' }}>Vardan</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}