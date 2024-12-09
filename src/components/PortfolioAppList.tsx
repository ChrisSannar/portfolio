import React from 'react';
import './PortfolioAppList.css';
import { PortApp } from '../data/PortApp';
import { PortfolioApp } from './PortfolioApp';
import { remToPx } from '../data/util';

const PORTFOLIO_APP_HEIGHT_REM = 10;
const PORTFOLIO_APP_WIDTH_REM = 6;
const PORTFOLIO_APP_GRID_GAP_REM = 3;

export const PortfolioAppList: React.FC = () => {
  const [apps] = React.useState(PortApp.getAllApps());
  const [appIndexOpen, setAppIndexOpen] = React.useState<number>(-1);
  const [itemsPerRow, setItemsPerRow] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onPortfolioAppClick = (appId: string, index: number) => {
    if (appIndexOpen === index) {
      setAppIndexOpen(-1);
      return;
    }
    setAppIndexOpen(index);
  }

  const indexInRange = (index: number, appIndexOpen: number, itemsPerRow: number) => {
    if (appIndexOpen === -1) {
      return false;
    }

    const rowStart = Math.floor(appIndexOpen / itemsPerRow) * itemsPerRow;
    const rowEnd = rowStart + itemsPerRow;
    return index >= rowStart && index < rowEnd;
  }

  React.useEffect(() => {
    const calculateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth + remToPx(PORTFOLIO_APP_GRID_GAP_REM, document);
        const itemWidth = remToPx(PORTFOLIO_APP_WIDTH_REM, document) + (remToPx(PORTFOLIO_APP_GRID_GAP_REM, document));
        const newItemsPerRow = Math.floor(containerWidth / itemWidth);
        setItemsPerRow(newItemsPerRow);
      }
    };

    calculateItemsPerRow();
    window.addEventListener('resize', calculateItemsPerRow);

    return () => {
      window.removeEventListener('resize', calculateItemsPerRow);
    };
  }, []);

  const labels = <div className="labels-container">
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

  return (
    <div className='PortfolioAppList'>
      <div className="AppList">
        <div 
          className="PortfolioApps" 
          style={{ 
            gridGap: `${PORTFOLIO_APP_GRID_GAP_REM}rem`,
          }}
          ref={containerRef}
        >
          {apps.map((app, index) => 
            <div 
              className="PortfolioAppWrapper" 
              key={app.id} 
              style={{
                maxWidth: `${PORTFOLIO_APP_WIDTH_REM}rem`,
                height: `${PORTFOLIO_APP_HEIGHT_REM}rem`,
                marginBottom: indexInRange(index, appIndexOpen, itemsPerRow) ? `10rem` : `0`,
              }}
            >
              <PortfolioApp 
                key={app.id} 
                app={app} 
                onClick={appId => onPortfolioAppClick(appId, index)}
              />
              {index === appIndexOpen && (<div>
                <p>Content: {app.Title}</p>
              </div>)}
            </div>
          )}
        </div>
      </div>
      {labels}
    </div>
  );
};
