import React, { useState, useEffect, useRef } from 'react';
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
  const [showBookmark, setShowBookmark] = useState(true);
  const [typedName, setTypedName] = useState('');
  const fullName = 'Vardan [NGIT\'28]';
  
  // Typing effect for the name
  useEffect(() => {
    let timer;
    
    if (typedName.length < fullName.length) {
      timer = setTimeout(() => {
        setTypedName(prev => fullName.substring(0, prev.length + 1));
      }, 150);
    } else {
      // Reset and start over after a pause
      timer = setTimeout(() => {
        setTypedName('');
      }, 2500);
    }
    
    return () => clearTimeout(timer);
  }, [typedName]);

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

  // Error notification system with queue
  const [notifications, setNotifications] = useState([]);
  const notificationTimeoutRef = useRef(null);

  const showError = (message) => {
    // Add new notification to queue
    setNotifications(prev => [...prev, message]);
  };

  // Process notifications queue
  useEffect(() => {
    const processQueue = async () => {
      if (notifications.length > 0 && !notificationTimeoutRef.current) {
        // Show first notification in queue
        const currentNotification = notifications[0];
        
        // Clear timeout if it exists
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }

        // Set timeout to remove current notification
        notificationTimeoutRef.current = setTimeout(() => {
          setNotifications(prev => prev.slice(1));
          notificationTimeoutRef.current = null;
        }, 3000);
      }
    };

    processQueue();

    // Cleanup on unmount
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [notifications]);

  const ErrorNotification = () => {
    if (notifications.length === 0) return null;
    
    return (
      <div key={notifications[0]} className="error-notification">
        {notifications[0]}
      </div>
    );
  };

  const handleSubmit = async (number) => {
    if (!number || typeof number !== 'string' || number.trim() === '') {
      showError('Incorrect number, try again with your parents\' number.');
      return;
    }

    // Don't start new request if we're already loading
    if (isLoading) return;

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
        // Store data first
        setAttendanceData(data);
        
        // Update previous searches
        setPreviousSearches(prev => {
          if (prev.includes(number)) return prev;
          const updatedSearches = [number, ...prev].slice(0, 5);
          return updatedSearches;
        });

        // Set loading to false before transition
        setIsLoading(false);
        
        // Transition after a small delay
        setTimeout(() => {
          setTransitionState('fade-in');
        }, 100);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      showError('Incorrect number, try again with your parents\' number.');
      setTransitionState('initial');
      setIsLoading(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

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
          <p className="loader-text">Getting your attendance...</p>
        </div>
      </div>
    );
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
        <ErrorNotification />
        {!attendanceData && (
          <nav className="nav-bar">
            <Link href="/test.html" className="nav-link">CIE</Link>
            <Link href="https://ngit24.github.io/pyq/" className="nav-link">PYQs</Link>
            <Link href="https://raw.githubusercontent.com/ngit24/Attendance/main/almanac.jpg" className="nav-link">Almanac</Link>
          </nav>
        )}
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
        </div>

        {!attendanceData && (
          <>
            <section className="social-icons-container">
              <a 
                href="https://instagram.com/vardn.19" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://github.com/localhost969" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </section>
            
            {/* Removed "Explore My other projects" section */}
          </>
        )}
      </div>
      
      {/* Professional footer implementation */}
      <footer>
        <div className="footer-content">
          <p>
            <span className="highlight-text">NGIT Student Tracker</span> • {new Date().getFullYear()}
          </p>
          <p>
            Designed by <span className="highlight-text">{typedName}</span>
          </p>
        </div>
      </footer>
    </>
  );
}