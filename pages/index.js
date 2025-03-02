import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import '../styles/index.css';
import '../styles/greeting.css';
import AttendanceData from '../components/AttendanceData';
import InputSection from '../components/InputSection';

export default function Home() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (number) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://test.89determined.workers.dev/?mobile_number=${number}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      console.log("Data received:", data);
      
      if (data) {
        setAttendanceData(data);
      } else {
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('wrong number, Try again with parents number only.');
    } finally {
      setIsLoading(false);
    }
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

      <footer className="text-center py-4 text-gray-600">
        <p>Made with ❤️ by <span className="font-semibold text-orange-600">Vardan</span></p>
      </footer>
    </div>
  );
}