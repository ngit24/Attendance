import { useEffect } from "react";
import { gsap } from "gsap";
import DaywiseAttendance from "./DaywiseAttendance";
import SubjectWiseAttendance from "./SubjectWiseAttendance";
import "../styles/greeting.css";

export default function AttendanceData({ data }) {
  useEffect(() => {
    if (data && data.name) {
      document.querySelector(".data-section").style.display = "block";
      const attendanceDataDiv = document.getElementById("attendanceData");
      gsap.from(attendanceDataDiv, { opacity: 0, y: 50, duration: 1 });
    }
  }, [data]);

  if (!data || !data.attendance) {
    return <div>Loading...</div>;
  }

  const { name, attendance } = data;
  const { overallattperformance, attandance } = attendance;
  
  // Get the update date from the first day object
  const updateDate = attandance.dayobjects[0]?.updatedon || "Not available";
  
  // Get the total percentage
  const totalPercentage = overallattperformance.totalpercentage || "0";

  return (
    <div id="attendanceData" className="data-section">
      <div className="greeting-card">
        <h2 id="studentName">{`Hello, ${name}!`}</h2>
        <div className="percentage-circle">
          <span id="totalPercentage">{`${totalPercentage}%`}</span>
        </div>
        <p id="updatedOn">Last Updated: {updateDate}</p>
      </div>
      
      {/* Pass the day objects to DaywiseAttendance */}
      <DaywiseAttendance days={attandance.dayobjects} />
      
      {/* Pass the subject data to SubjectWiseAttendance */}
      <SubjectWiseAttendance subjects={overallattperformance.overall} />
    </div>
  );
}