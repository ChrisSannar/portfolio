import React from 'react';

import './AppComp.css';
import { Resume } from './components/resume/Resume';

import { App, ColorModeType } from './data/App';

export function AppComp() {
  const app = App.getHotInstance().subscribe('App');
  const appCompRef = React.useRef<HTMLDivElement | null>(null);

  const setDarkMode = () => {
    App.Instance.ColorMode = ColorModeType.DARK;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('color-scheme', 'dark');
    });
  };
  
  const setLightMode = () => {
    App.Instance.ColorMode = ColorModeType.LIGHT;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('color-scheme', 'light');
    });
  };

  React.useEffect(() => {
    if (app.ColorMode === ColorModeType.DARK) {
      setDarkMode();
    } else {
      setLightMode();
    }
  }, [app.ColorMode]);

  React.useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      setDarkMode();
    } else {
      setLightMode();
    }

    prefersDarkScheme.addEventListener('change', (e) => {
      if (e.matches) {
        setDarkMode();
      } else {
        setLightMode();
      }
    });

    return () => {
      prefersDarkScheme.removeEventListener('change', () => {});
    };
  }, []);

  return (
    <AppCompContext.Provider value={appCompRef.current}>
      <div 
        className="AppComp" 
        ref={ref => appCompRef.current = ref}
        style={{ height: app.ResumeMode ? "auto" : "100%"}}  
      >
        <div className="header">
          <h1>Hi, I&apos;m Chris</h1>
          <h3>Full Stack Software Engineer</h3>
          <h3>Systems, Education, and AI Integrated Learning</h3>
        </div>
        <Resume />
      </div>
    </AppCompContext.Provider>
  );
}

const AppCompContext = React.createContext<HTMLDivElement | null>(null);
export const useAppCompContext = () => React.useContext(AppCompContext); 

// export default AppComp;
