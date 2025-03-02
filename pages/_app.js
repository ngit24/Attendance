// In pages/_app.js
import '../styles/index.css';
import '../styles/greeting.css';
import '../styles/neo-day.css';
import '../styles/sub.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;