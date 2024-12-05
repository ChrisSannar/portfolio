import React from 'react';
import './AppComp.css';
import { PortfolioAppList } from './components/PortfolioAppList';
import { PortfolioFooter } from './components/PortfolioFooter';

function AppComp() {
  // const app = App.getHotInstance().subscribe('App');

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
