import React from 'react';
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

  const portfolioAppListRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const currentRef = React.useRef<HTMLDivElement | null>(null);
  const appRefsMap = React.useRef<Map<string, HTMLDivElement>>(new Map());
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

  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const drawLine = (
    fromEl: HTMLElement | null, 
    toEl: HTMLElement | null,
    otherElements: HTMLElement[] = [],
    leftSide: boolean = true
  ) => {
    if (!svgRef.current || fromEl === null || toEl === null) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const portfolioAppLisRect = portfolioAppListRef.current?.getBoundingClientRect();

    if (!portfolioAppLisRect) return;

    // Calculate positions relative to container
    const x1 = fromRect.right - portfolioAppLisRect.left;
    const y1 = (fromRect.top + fromRect.height / 2) - portfolioAppLisRect.top;
    const x2 = toRect.left - portfolioAppLisRect.left;
    const y2 = (toRect.top + toRect.height / 2) - portfolioAppLisRect.top;
    // const x1 = 0;
    // const y1 = 0;
    // const x2 = 110;
    // const y2 = 110;

    // Clear previous lines
    svgRef.current.innerHTML = '';

    // Draw new line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // line.setAttribute('x1', x1.toString());
    // line.setAttribute('y1', y1.toString());
    // line.setAttribute('x2', x2.toString());
    // line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '2');
    
    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newPath.setAttribute('d', `M ${x1} ${y1} ${x2} ${y2}`);
    newPath.setAttribute('stroke', '#ffffff');
    newPath.setAttribute('fill', 'transparent');
    newPath.setAttribute('stroke-width', '2');

    svgRef.current.appendChild(newPath);
    
    // svgRef.current.appendChild(line);
  };

  const labels = <div className="labels-container">
    <div className="LeftLabels">
      <div className='PortfolioLabel' onMouseEnter={(ev) => drawLine(ev.currentTarget, appRefsMap.current.get(apps[0].id) || null)}>
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
    <div className='PortfolioAppList' ref={ref => portfolioAppListRef.current = ref}>
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
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
              ref={ref => {
                if (ref) {
                  if (appOpen) {
                    currentRef.current = ref;
                  }
                  appRefsMap.current.set(app.id, ref);
                } else {
                  appRefsMap.current.delete(app.id);
                }
              }}
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
