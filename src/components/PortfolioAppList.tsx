import React from 'react';
import './PortfolioAppList.css';
import { PortApp } from '../data/PortApp';
import { PortfolioApp } from './PortfolioApp';
import { remToPx } from '../data/util';

const PORTFOLIO_APP_HEIGHT_REM = 10;
const PORTFOLIO_APP_WIDTH_REM = 6;
const PORTFOLIO_APP_GRID_GAP_REM = 3;
const PORTFOLIO_APP_CONTENT_HEIGHT_REM = 24;
// const STYLE_TRANSITION_TIME = 0.2;

export const PortfolioAppList: React.FC = () => {
  const [apps] = React.useState(PortApp.getAllApps());
  const [appIndexOpen, setAppIndexOpen] = React.useState<number>(-1);
  const [itemsPerRow, setItemsPerRow] = React.useState(0);
  const [, rerender] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const currentRef = React.useRef<HTMLDivElement | null>(null);
  const openAppRef = React.useRef<HTMLDivElement | null>(null);

  const onPortfolioAppClick = (e: React.MouseEvent, appId: string, index: number) => {
    if (appIndexOpen === index) {
      setAppIndexOpen(-1);
      return;
    }
    currentRef.current = e.currentTarget as HTMLDivElement;
    
    setAppIndexOpen(index);
  }

  const indexInRange = (index: number, appIndexOpen: number, itemsPerRow: number) => {
    if (appIndexOpen === -1) {
      return false;
    }

    const rowStart = Math.floor(appIndexOpen / (itemsPerRow || 1)) * itemsPerRow;
    const rowEnd = rowStart + itemsPerRow;
    return index >= rowStart && index < rowEnd;
  }

  React.useLayoutEffect(() => {
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

  React.useEffect(() => {
    rerender(n => n + 1);
    if (openAppRef?.current)
      openAppRef.current = null;
  }, [openAppRef?.current]);

  const labels = <div className="labels-container">
    <div className="LeftLabels">
      <div className='PortfolioLabel'>
        <h3>Lorem</h3>
      </div>
      <div className='PortfolioLabel'>
        <h3>Ipsum</h3>
      </div>
    </div>
    <div className="RightLabels">
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
            position: 'relative',
          }}
          ref={containerRef}
        >
          {apps.map((app, index) => {
            const appOpen = appIndexOpen === index;
            const currentRect = currentRef.current?.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();
            const topPosition = currentRef.current ? 
              currentRef.current.offsetTop +  // The top of the app
              remToPx(PORTFOLIO_APP_HEIGHT_REM, document)  // The height of the app
              : 0;

            return <div 
              className="PortfolioAppWrapper" 
              key={app.id} 
              style={{
                maxWidth: `${PORTFOLIO_APP_WIDTH_REM}rem`,
                height: `${PORTFOLIO_APP_HEIGHT_REM}rem`,
                marginBottom: indexInRange(index, appIndexOpen, itemsPerRow) ? `${PORTFOLIO_APP_CONTENT_HEIGHT_REM}rem` : `0`,
              }}
              ref={appOpen ? currentRef : null}
            >
              <PortfolioApp 
                key={app.id} 
                app={app} 
                onClick={e => onPortfolioAppClick(e, app.id, index)}
              />
              {appOpen && 
                (<div 
                  className="PortfolioAppContent"
                  style={{
                    position: 'absolute',
                    top: `${topPosition + remToPx(1, document)}px`,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    maxHeight: `${PORTFOLIO_APP_CONTENT_HEIGHT_REM}rem`,
                    pointerEvents: 'none',
                  }}
                  ref={ref => {
                    openAppRef.current = ref ?? null
                  }}
                >
                  {app.Title}
                </div>)
              }
            </div>
          })}
        </div>
      </div>
      {labels}
    </div>
  );
};
