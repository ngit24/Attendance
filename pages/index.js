import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import '../pages/_app.js'; // Assuming global styles, keep if needed
import AttendanceData from '../components/AttendanceData';
import InputSection from '../components/InputSection';

export default function Home() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup state for errors


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
      console.log("Data received:", data);
      
      // Check if data is valid before setting state
      if (data && Object.keys(data).length > 0) {
        setAttendanceData(data);
      } else {
        throw new Error('Invalid response from server'); // Empty or malformed data
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      setShowPopup(true); // Show popup for any error
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="dashboard">
      <Head>
        <title>NGIT Student Portal</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      {!attendanceData && <Header />}
      
      {!attendanceData ? (
        <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
      ) : (
        <AttendanceData data={attendanceData} />
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Incorrect number, try again with your parents' number.</p>
            <button onClick={closePopup} className="popup-close-btn">Got it</button>
          </div>
        </div>
      )}

      <footer className="text-center py-4 text-gray-600">
        <p>Made with ❤️ by <span className="font-semibold text-orange-600">Vardan</span></p>
      </footer>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 300px;
          width: 100%;
        }
        .popup p {
          color: #333;
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        .popup-close-btn {
          background: #ff3366;
          color: #fff;
          padding: 8px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .popup-close-btn:hover {
          background: #cc2952;
        }
      `}</style>
    </div>
  );
}