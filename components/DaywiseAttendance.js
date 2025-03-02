import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../pages/_app.js';

const DaywiseAttendance = ({ days }) => {
  const [expanded, setExpanded] = useState(false);
  const [todayData, setTodayData] = useState(null);
  const [pastDays, setPastDays] = useState([]);
  
  useEffect(() => {
    if (!days || days.length === 0) return;
    
    // Find today's data (first day is usually today)
    const today = days.find(day => day.day === "Today") || days[0];
    setTodayData(today);
    
    // Get past days (excluding today)
    const past = days.filter(day => day !== today && day.holiday !== 'true');
    setPastDays(past);
  }, [days]);
  
  if (!days || days.length === 0) {
    return <div className="no-data">No attendance data available</div>;
  }
  
  const formatDate = (dateStr) => {
    return dateStr.replace(/^\w+ /, ''); // Remove day of week
  };
  
  return (
    <div className="neo-timeline-container">
      <div className="timeline-header">
        <h2>Day-wise Attendance</h2>
        <motion.button 
          className="expand-toggle"
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          {expanded ? 'Show Less' : 'Show All'}
          <span className={`toggle-icon ${expanded ? 'expanded' : ''}`}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </motion.button>
      </div>
      
      {todayData && (
        <motion.div 
          className="day-timeline today-timeline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="timeline-day-header">
            <div className="day-label">Today</div>
            <div className="day-date">{formatDate(todayData.date)}</div>
          </div>
          
          <div className="timeline-sessions">
            {Object.entries(todayData.sessions).map(([session, value], index) => (
              <motion.div
                key={session}
                className={`session-dot status-${value}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.2,
                  boxShadow: '0 0 15px var(--glow-color)'
                }}
                data-period={session.replace('session', 'P')}
                data-status={value === '1' ? 'Present' : value === '0' ? 'Absent' : 'Not Taken'}
              >
                <span className="dot-core"></span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="past-days-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pastDays.map((day, dayIndex) => (
              <motion.div 
                className="day-timeline"
                key={dayIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.1, duration: 0.4 }}
              >
                <div className="timeline-day-header">
                  <div className="day-date">{formatDate(day.date)}</div>
                </div>
                
                <div className="timeline-sessions">
                  {Object.entries(day.sessions).map(([session, value], index) => (
                    <motion.div
                      key={session}
                      className={`session-dot status-${value}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: index * 0.03 + dayIndex * 0.05,
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 15px var(--glow-color)'
                      }}
                      data-period={session.replace('session', 'P')}
                      data-status={value === '1' ? 'Present' : value === '0' ? 'Absent' : 'Not Taken'}
                    >
                      <span className="dot-core"></span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-dot status-1"></div>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot status-0"></div>
          <span>Absent</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot status-2"></div>
          <span>Not Taken</span>
        </div>
      </div>
    </div>
  );
};

export default DaywiseAttendance;