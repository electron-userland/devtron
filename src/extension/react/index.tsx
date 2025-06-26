import { createRoot } from 'react-dom/client';
import App from './App';
import '../index.css';

import '@fontsource-variable/roboto'; // supports 100-900 weights
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

/* --------------------- WEBPACK HMR -------------------- */
if (module.hot)
  module.hot.accept('./App', () => {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const NextApp = require('./App').default;
    root.render(<NextApp />);
  });
/* ------------------------------------------------------ */
