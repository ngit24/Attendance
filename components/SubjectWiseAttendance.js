import React from 'react';
import { motion } from 'framer-motion';
import '../styles/sub.css';

const SubjectWiseAttendance = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  // Process and combine subject percentages
  const processedSubjects = subjects.map(subject => {
    let effectivePercentage;
    if (subject.percentage !== "--") {
      effectivePercentage = parseFloat(subject.percentage);
    } else if (subject.practical !== "--") {
      effectivePercentage = parseFloat(subject.practical);
    } else {
      effectivePercentage = 0;
    }
    
    // Format percentage text
    let percentageText;
    if (subject.percentage !== "--" && subject.practical !== "--") {
      percentageText = `${subject.percentage}%`;
    } else if (subject.percentage !== "--") {
      percentageText = `${subject.percentage}%`;
    } else if (subject.practical !== "--") {
      percentageText = `${subject.practical}%`;
    } else {
      percentageText = '0%';
    }
    
    return {
      ...subject,
      effectivePercentage,
      percentageText
    };
  });

  // Sort subjects by lowest percentage first
  const sortedSubjects = [...processedSubjects].sort((a, b) => {
    return a.effectivePercentage - b.effectivePercentage;
  });

  // Get attendance category
  const getAttendanceCategory = (percentage) => {
    if (percentage >= 75) return 'high';
    if (percentage >= 65) return 'medium';
    return 'low';
  };

  return (
    <div className="subjects-container">
      <div className="subject-table-container">
        <div className="timeline-header">
          <h2>Subject-wise Attendance</h2>
        </div>
        
        <table className="subject-compact-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubjects.map((subject, index) => {
              const category = getAttendanceCategory(subject.effectivePercentage);
              
              return (
                <motion.tr 
                  key={index}
                  className={`${category}-attendance`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <td className="subject-name-col">
                    {subject.subjectname}
                  </td>
                  <td className="subject-status-col">
                    <div className="percentage-bar-container">
                      <span className={`percentage-value ${category}`}>
                        {subject.percentageText}
                      </span>
                      <div className="percentage-bar">
                        <motion.div 
                          className={`percentage-fill ${category}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, subject.effectivePercentage)}%` }}
                          transition={{ delay: 0.1 + index * 0.03, duration: 0.6 }}
                        ></motion.div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectWiseAttendance;