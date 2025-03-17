import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import DaywiseAttendance from "./DaywiseAttendance";
import SubjectWiseAttendance from "./SubjectWiseAttendance";

import '../pages/_app.js';

export default function AttendanceData({ data }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [percentageLoaded, setPercentageLoaded] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const chargerRef = useRef(null);
  const animationRef = useRef(null);
  const boostRef = useRef(null);
  const circleRef = useRef(null);
  const containerRef = useRef(null);
  const studentNameRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle data initialization and animations
  useEffect(() => {
    // Validate data exists and has required structure
    if (data && data.name && data.attendance) {
      // First set the component as ready
      setIsReady(true);
      
      // Short delay to ensure DOM elements are properly rendered
      setTimeout(() => {
        setIsVisible(true);
        
        if (containerRef.current) {
          // Ensure the container is visible first
          containerRef.current.style.opacity = "1";
          containerRef.current.style.display = "block";
          
          // Then animate it
          gsap.from(containerRef.current, { 
            opacity: 0, 
            y: 50, 
            duration: 1,
            onComplete: () => {
              // Start percentage animation after container animation
              animatePercentage();
            }
          });
        }

        // Adjust font size until full name is visible
        if (studentNameRef.current) {
          const adjustFontSize = () => {
            const element = studentNameRef.current;
            let fontSize = 1.8; // Start with default size in rem
            element.style.fontSize = `${fontSize}rem`;
            
            while (element.scrollWidth > element.clientWidth && fontSize > 0.8) {
              fontSize -= 0.1;
              element.style.fontSize = `${fontSize}rem`;
            }
          };
          
          // Initial adjustment
          adjustFontSize();
          
          // Also adjust on window resize
          window.addEventListener('resize', adjustFontSize);
          return () => window.removeEventListener('resize', adjustFontSize);
        }
      }, 50);
    }
  }, [data]);

  const animatePercentage = () => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Safely access data with fallbacks to prevent errors
    const targetPercentage = Math.min(100, 
      parseFloat(data?.attendance?.overallattperformance?.totalpercentage || 0)
    );
    
    // Reset the CSS variable to 0 before starting animation
    if (circleRef.current) {
      circleRef.current.style.setProperty('--percentage', '0');
    }
    
    // Small delay to ensure the reset is visible
    setTimeout(() => {
      if (circleRef.current) {
        animationRef.current = gsap.to(circleRef.current, {
          '--percentage': targetPercentage,
          duration: 1.5,
          ease: "power2.out",
          onStart: () => setPercentageLoaded(0),
          onUpdate: function() {
            setPercentageLoaded(Math.round(this.progress() * targetPercentage));
          },
          onComplete: () => {
            animationRef.current = null;
          }
        });
      }

      // Light boost animation
      if (boostRef.current) {
        gsap.fromTo(boostRef.current,
          { scale: 0, opacity: 1 },
          { 
            scale: 2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
          }
        );
      }
    }, 50);
  };

  // Show loader if data is not ready
  if (!isReady || !data || !data.attendance) {
    return (
      <div className="attendance-loading">
        <div className="loading-spinner"></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  const { name, attendance } = data;
  const { overallattperformance, attandance } = attendance;
  const updateDate = attandance?.dayobjects?.[0]?.updatedon || "Not available";

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate additional attendance stats
  const calculateStats = () => {
    if (!overallattperformance || !overallattperformance.overall) {
      return { bestSubject: 'N/A', worstSubject: 'N/A', daysPresent: 0 };
    }

    let bestSubject = { name: 'N/A', percentage: 0 };
    let worstSubject = { name: 'N/A', percentage: 100 };
    
    // Safely process subjects
    if (Array.isArray(overallattperformance.overall)) {
      overallattperformance.overall.forEach(subject => {
        if (subject && subject.percentage) {
          const percentage = parseFloat(subject.percentage);
          if (!isNaN(percentage)) {
            if (percentage > bestSubject.percentage) {
              bestSubject = { 
                name: subject.subjectname || 'Unknown', 
                percentage 
              };
            }
            if (percentage < worstSubject.percentage) {
              worstSubject = { 
                name: subject.subjectname || 'Unknown', 
                percentage 
              };
            }
          }
        }
      });
    }

    // Count days present - with safe checks
    let daysPresent = 0;
    if (attandance && Array.isArray(attandance.dayobjects)) {
      daysPresent = attandance.dayobjects.filter(day => 
        day && day.status && day.status.toLowerCase() === 'present'
      ).length;
    }

    return { 
      bestSubject: `${bestSubject.name} (${bestSubject.percentage}%)`, 
      worstSubject: `${worstSubject.name} (${worstSubject.percentage}%)`,
      daysPresent
    };
  };

  const stats = calculateStats();

  return (
    <div className="attendance-container">
      <div 
        className="attendance-dashboard" 
        ref={containerRef}
        style={{ 
          display: "none", // Initially hidden, will be shown by JS
          opacity: 0, // Start with opacity 0
          width: "100%" // Ensure full width
        }}
      >
        {/* Top Row: Just Greeting Card */}
        <div className="greeting-section">
          {/* Greeting Header */}
          <div className="greeting-header">
            <h1 className="greeting-text">{getGreeting()},</h1>
            <h2 ref={studentNameRef} className="gradient-text">{name}</h2>
          </div>
        </div>
        
        {/* Middle Row: Overall Attendance + Daywise side by side */}
        <div className="middle-row">
          {/* Overall Attendance Card */}
          <div className="attendance-card">
            <h3 className="card-heading">Overall Attendance</h3>
            <div className="percentage-circle-container">
              <div 
                className="percentage-circle" 
                ref={(el) => { chargerRef.current = el; circleRef.current = el; }}
                onClick={animatePercentage}
              >
                <div className="boost-effect" ref={boostRef}></div>
                <div className="percentage-circle-inner">
                  <span id="totalPercentage">{percentageLoaded}%</span>
                  <span className="percentage-label"></span>
                </div>
              </div>
            </div>
            <p id="updatedOn"><span className="green-neon-dot"></span> Last updated: {formatTime(currentTime)}</p>
          </div>
          
          {/* Daywise Attendance */}
          <div className="attendance-component daywise-component">
            <DaywiseAttendance days={attandance.dayobjects} />
          </div>
        </div>
        
        {/* Bottom Row: Subject Wise Attendance - Full Width */}
        <div className="bottom-row">
          <div className="attendance-component subject-component full-width">
            <SubjectWiseAttendance subjects={overallattperformance.overall} />
          </div>
        </div>
      </div>
    </div>
  );
}
