import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function AcademicCalendar() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Google Drive PDF link
  const pdfUrl = "https://drive.google.com/file/d/1z4MNySP1yyhab-u1mO9xo_ww-oE5otIs/preview";

  return (
    <>
      <Head>
        <title>Academic Calendar - NGIT</title>
        <meta name="description" content="NGIT Academic Calendar and Important Dates" />
      </Head>

      <div className="almanac-container">
        <div className="almanac-header">
          <Link href="/" className="back-button">
            <i className="fas fa-arrow-left"></i> Back
          </Link>
          <h1>Academic Calendar</h1>
          <a 
            href="https://raw.githubusercontent.com/ngit24/Attendance/main/almanac.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="download-button"
          >
            <i className="fas fa-download"></i> Download
          </a>
        </div>

        <div className="pdf-viewer">
          {isLoading && (
            <div className="calendar-loader">
              <div className="calendar-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="loader-message">
                <h3>Loading Academic Calendar</h3>
                <p>Please wait while we fetch the document...</p>
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <iframe
            src={pdfUrl}
            onLoad={() => setIsLoading(false)}
            title="Academic Calendar"
            className="pdf-frame"
            allow="autoplay"
          />
        </div>
      </div>
    </>
  );
}
