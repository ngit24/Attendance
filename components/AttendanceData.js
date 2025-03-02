import { useEffect } from "react";
import { gsap } from "gsap";
import DaywiseAttendance from "./DaywiseAttendance";
import SubjectWiseAttendance from "./SubjectWiseAttendance";
import '../pages/_app.js';

export default function AttendanceData({ data }) {
  useEffect(() => {
    if (data && data.name) {
      document.querySelector(".data-section").style.display = "block";
      const attendanceDataDiv = document.getElementById("attendanceData");
      gsap.from(attendanceDataDiv, { opacity: 0, y: 50, duration: 1 });

      // Dynamically adjust font size for long names
      const studentNameEl = document.getElementById("studentName");
      if (studentNameEl.scrollWidth > studentNameEl.clientWidth) {
        const fontSize = parseFloat(window.getComputedStyle(studentNameEl).fontSize);
        studentNameEl.style.fontSize = `${fontSize * 0.9}px`; // Shrink by 10% if needed
      }
    }
  }, [data]);

  if (!data || !data.attendance) {
    return <div>Loading...</div>;
  }

  const { name, attendance } = data;
  const { overallattperformance, attandance } = attendance;
  
  const updateDate = attandance.dayobjects[0]?.updatedon || "Not available";
  const totalPercentage = overallattperformance.totalpercentage || "0";

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div id="attendanceData" className="data-section">
      <h1 className="greeting-text">{getGreeting()}</h1>
      <h2 id="studentName">{name}!</h2>
      <div className="greeting-card">
        <h3 className="card-heading">Overall Attendance</h3>
        <div className="percentage-circle">
          <span id="totalPercentage">{totalPercentage}%</span>
        </div>
        <p id="updatedOn">Last Updated: {updateDate}</p>
      </div>
      
      <DaywiseAttendance days={attandance.dayobjects} />
      <SubjectWiseAttendance subjects={overallattperformance.overall} />
    </div>
  );
}