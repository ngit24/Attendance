import '../styles/index.css';
import '../styles/greeting.css';
import '../styles/day.css';
import '../styles/sub.css';
import '../styles/birthday.css';
import '../styles/almanac.css';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if user has previously set theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved theme
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Create theme toggle button
    const createThemeToggleButton = () => {
      // Check if button already exists
      if (document.querySelector('.theme-switch-wrapper')) return;

      const themeSwitch = document.createElement('div');
      themeSwitch.className = 'theme-switch-wrapper';
      
      const button = document.createElement('button');
      button.className = 'theme-switch';
      button.setAttribute('aria-label', 'Toggle theme');
      button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      
      // Create SVG icons for sun and moon
      const sunSvg = `<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;

      const moonSvg = `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
      
      button.innerHTML = sunSvg + moonSvg;
      button.addEventListener('click', toggleTheme);
      
      // Add tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'theme-tooltip';
      tooltip.textContent = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      
      themeSwitch.appendChild(button);
      themeSwitch.appendChild(tooltip);
      document.body.appendChild(themeSwitch);
    };

    createThemeToggleButton();

    return () => {
      // Clean up the button when component unmounts
      const themeToggle = document.querySelector('.theme-switch-wrapper');
      if (themeToggle) {
        themeToggle.remove();
      }
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update tooltip text
    const tooltip = document.querySelector('.theme-tooltip');
    if (tooltip) {
      tooltip.textContent = newTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
    
    // Update button aria attributes
    const button = document.querySelector('.theme-switch');
    if (button) {
      button.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;