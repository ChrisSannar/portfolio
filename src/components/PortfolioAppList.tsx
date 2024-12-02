import React from 'react';
import './PortfolioAppList.css';
import { PortApp } from '../data/PortApp';
import { PortfolioApp } from './PortfolioApp';

export const PortfolioAppList: React.FC = () => {
  const [apps] = React.useState(PortApp.getAllApps());

  return (
    <div className='PortfolioAppList'>
      <div className="labels-container">
        <div className="LeftLables">
          <div className='PortfolioLabel'>
            <h3>Lorem</h3>
          </div>
          <div className='PortfolioLabel'>
            <h3>Ipsum</h3>
          </div>
        </div>
        <div className="RightLables">
          <div className='PortfolioLabel'>
            <h3>Lorem Ipsum</h3>
          </div>
          <div className='PortfolioLabel'>
            <h3>Ipsum Lorem</h3>
          </div>
        </div>
      </div>
      <div className="AppList">
        <div className="PortfolioApps">
          {apps.map(app => 
            <div className="PortfolioAppWrapper">
              <PortfolioApp key={app.id} app={app} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
