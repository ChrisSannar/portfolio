import React from 'react';
import './App.css';
import { PortfolioAppList } from './components/PortfolioAppList';
import { PortfolioFooter } from './components/PortfolioFooter';

function App() {
  return (
    <div className="App">
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

export default App;
