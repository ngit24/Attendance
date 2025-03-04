import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';


// Mock data for development/fallback
const MOCK_DATA = {
  upcoming: [
    { name: "test", dob: "06/09/2069", ht_no: "245324748123" },
   
  ],
  today: []
};

// Add this array of random messages at the top level
const NO_BIRTHDAY_MESSAGES = [
  
  "No birthdays found today ",
  
];

const BirthdayCalendar = () => {
  const today = new Date();
  // Initialize with today's date selected
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isViewingToday, setIsViewingToday] = useState(true);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [selectedDateBirthdays, setSelectedDateBirthdays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateCalendar, setAnimateCalendar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  
  const apiBaseUrl = 'https://bday.89determined.workers.dev'; 

  // Extract day/month from date string
  const extractDayMonth = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return '';
    const parts = dateString.split('/');
    if (parts.length < 2) return '';
    return `${parts[0]}/${parts[1]}`;
  };

  // Add new helper function to check if date matches today
  const isDateToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const [day, month] = dateString.split('/');
    return parseInt(day) === today.getDate() && parseInt(month) === (today.getMonth() + 1);
  };

  // Add this function to get random message
  const getRandomMessage = () => {
    return NO_BIRTHDAY_MESSAGES[Math.floor(Math.random() * NO_BIRTHDAY_MESSAGES.length)];
  };

  // Generate calendar based on current month/year
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Create empty cells for days before the first day
    const emptyDays = Array.from({ length: startingDay }, (_, i) => (
      <div key={`empty-${i}`} className="empty"></div>
    ));
    
    // Create cells for each day of month
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isToday = day === new Date().getDate() && 
                      month === new Date().getMonth() && 
                      year === new Date().getFullYear();
      const isSelected = selectedDay === day;
      
      return (
        <div 
          key={`day-${day}`}
          className={`${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    });
    
    return [...emptyDays, ...monthDays];
  };

  // Handle month navigation
  const changeMonth = (direction) => {
    setAnimateCalendar(true);
    
    setTimeout(() => {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(prevDate.getMonth() + direction);
        
        // Check if we're still viewing today after month change
        const today = new Date();
        setIsViewingToday(
          selectedDay === today.getDate() && 
          newDate.getMonth() === today.getMonth() && 
          newDate.getFullYear() === today.getFullYear()
        );
        
        return newDate;
      });
      setAnimateCalendar(false);
    }, 300);
  };

  const previousMonth = () => changeMonth(-1);
  const nextMonth = () => changeMonth(1);

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDay(day);
    
    // Check if selected day is today
    const today = new Date();
    setIsViewingToday(
      day === today.getDate() && 
      currentDate.getMonth() === today.getMonth() && 
      currentDate.getFullYear() === today.getFullYear()
    );
    
    fetchBirthdaysForDate(day);
  };

  // Enhanced confetti effect for birthdays
  const triggerConfetti = useCallback(() => {
    if (typeof window !== 'undefined') {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const colors = ['#ff6f61', '#ffb347', '#a6c1ee', '#ffd1dc'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, []);

  // Fetch today's birthdays with error handling
  const fetchTodaysBirthdays = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiBaseUrl}/birthdays/today`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error("JSON parsing error:", e);
        data = MOCK_DATA.today;
      }
      
      // Filter birthdays to only include those that match today's local date
      const birthdays = Array.isArray(data) ? data.filter(birthday => isDateToday(birthday.dob)) : [];
      setTodaysBirthdays(birthdays);
      
      // Only trigger confetti if there are actual birthdays matching today's local date
      if (birthdays.length > 0 && !showConfetti) {
        setShowConfetti(true);
        setTimeout(() => triggerConfetti(), 500);
      } else {
        setShowConfetti(false);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching today\'s birthdays:', error);
      setTodaysBirthdays([]);
      setShowConfetti(false);
      setError("Could not load today's birthdays");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch upcoming birthdays with error handling
  const fetchUpcomingBirthdays = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiBaseUrl}/birthdays/upcoming`)
        .catch(err => {
          console.error("Network error:", err);
          throw new Error("Network error when fetching upcoming birthdays");
        });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error("JSON parsing error:", e);
        // Use mock data as fallback
        data = MOCK_DATA.upcoming;
      }
      
      setUpcomingBirthdays(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching upcoming birthdays:', error);
      setUpcomingBirthdays(MOCK_DATA.upcoming);
      setError("Could not load upcoming birthdays");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch birthdays for specific date with enhanced 404 handling
  const fetchBirthdaysForDate = async (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are 0-indexed
    const date = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}`;
    
    try {
      setIsLoading(true);
      // Clear any previous data while loading
      setSelectedDateBirthdays([]);
      
      const response = await fetch(`${apiBaseUrl}/birthdays/date/${date}`)
        .catch(err => {
          console.error("Network error:", err);
          throw new Error("Network error when fetching birthdays for date");
        });
      
      // Special handling for 404 - it just means no birthdays on this day
      if (response.status === 404) {
        console.log(`No birthdays found for ${day}/${month}/${year}`);
        setSelectedDateBirthdays([]);
        setError(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error("JSON parsing error:", e);
        data = [];
      }
      
      setSelectedDateBirthdays(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching birthdays for date:', error);
      setSelectedDateBirthdays([]);
      
      // Only set error state if it's not a 404 (which means no birthdays)
      if (!error.message.includes('404')) {
        setError(`Could not load birthdays for ${day}/${currentDate.getMonth() + 1}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data with smooth intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      // Fetch today's birthdays both for the banner and the selected day display
      fetchTodaysBirthdays();
      fetchUpcomingBirthdays();
      // Since today is pre-selected, also fetch birthdays for today's date
      fetchBirthdaysForDate(today.getDate());
    }, 300);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add script for confetti
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.confettiLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
      script.async = true;
      document.body.appendChild(script);
      window.confettiLoaded = true;
      
      return () => {
        document.body.removeChild(script);
        window.confettiLoaded = false;
      };
    }
  }, []);

  // Initialize today flag when component loads
  useEffect(() => {
    const today = new Date();
    if (
      selectedDay === today.getDate() && 
      currentDate.getMonth() === today.getMonth() && 
      currentDate.getFullYear() === today.getFullYear()
    ) {
      setIsViewingToday(true);
    }
  }, [selectedDay, currentDate]);

  // Single unified loader component
  const Loader = () => (
    <div className="unified-loader">
      <div className="loader-ring"></div>
      <p>Loading data...</p>
    </div>
  );

  return (
    <div className="birthday-container">
      <Head>
        <title>Birthday Calendar - NGIT Student Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

    

      <div className="birthday-content">
        <Link href="/" className="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        <h1>Birthday's Calendar</h1>
        
        <div className="layout">
          <div className="calendar-section">
            <div className="calendar-controls">
              <button onClick={previousMonth} aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
              <button onClick={nextMonth} aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="calendar-header">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            <div className={`calendar ${animateCalendar ? 'calendar-animate-out' : 'calendar-animate-in'}`}>
              {generateCalendar()}
            </div>
            
            {/* Only show birthday message when viewing today AND there are birthdays matching today's date */}
            {isViewingToday && todaysBirthdays.some(birthday => isDateToday(birthday.dob)) && (
              <div className="wish">🎉 Happy Birthday ! 🎉</div>
            )}
            
            {error && <div className="error">{error}</div>}
            
            {isLoading ? (
              <Loader />
            ) : (
              <div className="result">
                {selectedDateBirthdays && selectedDateBirthdays.length > 0 ? (
                  selectedDateBirthdays.map((item, index) => (
                    <div className="birthday-item" key={index} style={{animationDelay: `${index * 0.1}s`}}>
                      <p><strong>Name:</strong> {item.name || 'Unknown'}</p>
                      <p><strong>Department:</strong> {item.ht_no && item.ht_no.startsWith('245324748') ? 'CSM' : 'CSE'}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h.01M15 10h.01M12 14h.01M12 16l4 2-4-8-4 8 4-2z" />
                      </svg>
                    </div>
                    <p className="empty-state-message">{getRandomMessage()}</p>
                    <p className="empty-state-date">
                      <span className="date-chip">
                        {selectedDay} {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="upcoming-birthdays">
            <h2>Upcoming Birthdays (7 Days)</h2>
            {isLoading ? <Loader /> : (
              <div>
                {upcomingBirthdays && upcomingBirthdays.length > 0 ? (
                  upcomingBirthdays.map((item, index) => (
                    <div 
                      className="birthday-item" 
                      key={index}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <p>{item.dob ? extractDayMonth(item.dob) : 'Unknown'} - {item.ht_no && item.ht_no.startsWith('245324748') ? 'CSM' : 'CSE'}</p>
                      <p><strong>{item.name || 'Unknown'}</strong></p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No upcoming birthdays in the next 7 days</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center py-4 text-gray-600">
          <div className="footer-content">
            <p>
              Designed by <span className="font-semibold" style={{ color: 'var(--accent)' }}>Vardan</span>
            </p>
          </div>
        </footer>
    </div>
  );
};

export default BirthdayCalendar;
