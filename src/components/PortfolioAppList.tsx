import React, { useState } from 'react';
import './PortfolioAppList.css';
import { PortApp } from '../data/PortApp';
import { PortfolioApp } from './PortfolioApp';
import { remToPx } from '../data/util';

const PORTFOLIO_APP_HEIGHT_REM = 10;
const PORTFOLIO_APP_WIDTH_REM = 6;
const PORTFOLIO_APP_GRID_GAP_REM = 3;
const PORTFOLIO_APP_CONTENT_HEIGHT_REM = 24;
const ANIMATION_DURATION_MS = 300;
const CONTENT_RENDER_DELAY_MS = ANIMATION_DURATION_MS + 10;
const CONTENT_FADE_DURATION_MS = 200;

export const PortfolioAppList: React.FC = () => {
  const [apps] = React.useState(PortApp.getAllApps());
  const [appIndexOpen, setAppIndexOpen] = React.useState<number>(-1);
  const [itemsPerRow, setItemsPerRow] = React.useState(0);
  const [contentIndexToRender, setContentIndexToRender] = React.useState<number>(-1);
  const [contentFadedIn, setContentFadedIn] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const currentRef = React.useRef<HTMLDivElement | null>(null);
  const contentTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const onPortfolioAppClick = (e: React.MouseEvent, appId: string, index: number) => {
    // Closing the currently open app
    if (appIndexOpen === index) {
      // Fade out content first
      setContentFadedIn(false);
      
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      
      // After fade completes, remove content and collapse space
      fadeTimeoutRef.current = setTimeout(() => {
        setContentIndexToRender(-1);
        setAppIndexOpen(-1);
        fadeTimeoutRef.current = null;
      }, CONTENT_FADE_DURATION_MS);
      
      return;
    }
    
    // Switching to a different app
    if (appIndexOpen !== -1) {
      // Fade out current content first
      setContentFadedIn(false);
      
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      
      fadeTimeoutRef.current = setTimeout(() => {
        // Then switch to new app
        currentRef.current = e.currentTarget as HTMLDivElement;
        setAppIndexOpen(index);
        // Render new content immediately with opacity 0
        setContentIndexToRender(index);
        
        // Clear any pending content render timeout
        if (contentTimeoutRef.current) {
          clearTimeout(contentTimeoutRef.current);
        }
        
        // After space animation settles, fade in the content
        contentTimeoutRef.current = setTimeout(() => {
          setContentFadedIn(true);
          contentTimeoutRef.current = null;
        }, CONTENT_RENDER_DELAY_MS);
        
        fadeTimeoutRef.current = null;
      }, CONTENT_FADE_DURATION_MS);
      
      return;
    }
    
    // Opening the first app
    currentRef.current = e.currentTarget as HTMLDivElement;
    setAppIndexOpen(index);
    // Render content immediately with opacity 0
    setContentIndexToRender(index);
    setContentFadedIn(false);
    
    // Clear any pending timeout from previous click
    if (contentTimeoutRef.current) {
      clearTimeout(contentTimeoutRef.current);
    }
    
    // After space animation settles, fade in the content
    contentTimeoutRef.current = setTimeout(() => {
      setContentFadedIn(true);
      contentTimeoutRef.current = null;
    }, CONTENT_RENDER_DELAY_MS);
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
        setAppIndexOpen(-1);
        setContentIndexToRender(-1);
        setContentFadedIn(false);
      }
    };

    calculateItemsPerRow();
    window.addEventListener('resize', calculateItemsPerRow);

    return () => {
      window.removeEventListener('resize', calculateItemsPerRow);
    };
  }, []);

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
              {contentIndexToRender === index && 
                (() => {
                  return <div 
                    className="PortfolioAppContent"
                    style={{
                      position: 'absolute',
                      top: `${topPosition + remToPx(1, document)}px`,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      maxHeight: `${PORTFOLIO_APP_CONTENT_HEIGHT_REM}rem`,
                      pointerEvents: 'none',
                      opacity: contentFadedIn ? 1 : 0,
                      transition: `opacity ${CONTENT_FADE_DURATION_MS}ms ease-in-out`,
                    }}
                  >
                    {app.Title}
                  </div>
                })()
              }
            </div>
          })}
        </div>
      </div>
      {labels}
    </div>
  );
};
