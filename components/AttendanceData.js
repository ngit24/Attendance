import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import DaywiseAttendance from "./DaywiseAttendance";
import SubjectWiseAttendance from "./SubjectWiseAttendance";
import '../pages/_app.js';

export default function AttendanceData({ data }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [percentageLoaded, setPercentageLoaded] = useState(0);
  const chargerRef = useRef(null);
  const animationRef = useRef(null);
  const boostRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    if (data && data.name) {
      document.querySelector(".data-section").style.display = "block";
      const attendanceDataDiv = document.getElementById("attendanceData");
      gsap.from(attendanceDataDiv, { opacity: 0, y: 50, duration: 1 });

      animatePercentage();

      const studentNameEl = document.getElementById("studentName");
      if (studentNameEl.scrollWidth > studentNameEl.clientWidth) {
        const fontSize = parseFloat(window.getComputedStyle(studentNameEl).fontSize);
        studentNameEl.style.fontSize = `${fontSize * 0.9}px`;
      }
    }

    return () => clearInterval(timer);
  }, [data]);

  const animatePercentage = () => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const targetPercentage = parseFloat(data.attendance.overallattperformance.totalpercentage || 0);
    
    animationRef.current = gsap.to({ value: percentageLoaded }, {
      value: targetPercentage,
      duration: 1.5,
      ease: "power2.out",
      onStart: () => setPercentageLoaded(0),
      onUpdate: function() {
        setPercentageLoaded(Math.round(this.targets()[0].value));
      },
      onComplete: () => {
        animationRef.current = null;
      }
    });

    // Light boost animation
    gsap.fromTo(boostRef.current,
      { scale: 0, opacity: 1 },
      { 
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }
    );
  };

  if (!data || !data.attendance) {
    return <div>Loading...</div>;
  }

  const { name, attendance } = data;
  const { overallattperformance, attandance } = attendance;
  const updateDate = attandance.dayobjects[0]?.updatedon || "Not available";

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

  return (
    <div id="attendanceData" className="data-section">
      <h1 className="greeting-text">{getGreeting()},</h1>
      <h2 id="studentName" className="gradient-text">{name}</h2>
      
      <div className="greeting-card">
        <h3 className="card-heading">Overall Attendance</h3>
        <div 
          className="percentage-circle" 
          ref={chargerRef}
          onClick={animatePercentage}
          style={{ cursor: 'pointer' }}
        >
          <div className="boost-effect" ref={boostRef}></div>
          <span id="totalPercentage">{percentageLoaded}%</span>
        </div>
        <p id="updatedOn">Updated at {formatTime(currentTime)}</p>
      </div>
      
      <DaywiseAttendance days={attandance.dayobjects} />
      <SubjectWiseAttendance subjects={overallattperformance.overall} />
    </div>
  );
}