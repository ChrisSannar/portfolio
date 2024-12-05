import React from 'react';
import './AppComp.css';
import { PortfolioAppList } from './components/PortfolioAppList';
import { PortfolioFooter } from './components/PortfolioFooter';
import { App, ColorModeType } from './data/App';

function AppComp() {
  const app = App.getHotInstance().subscribe('App');

  const setDarkMode = () => {
    App.Instance.ColorMode = ColorModeType.DARK;
    document.documentElement.style.setProperty('color-scheme', 'dark');
  };
  
  const setLightMode = () => {
    App.Instance.ColorMode = ColorModeType.LIGHT;
    document.documentElement.style.setProperty('color-scheme', 'light');
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
    <div className="AppComp">
      <div className="header">
        <h1>Hi, I&apos;m Chris</h1>
        <h3>Full Stack Software Engineer<br/>Networking Emphasis</h3>
      </div>
      <PortfolioAppList />
      <div className="footer">
        <PortfolioFooter />
      </div>
    </div>
  );
}

export default AppComp;
