import React from 'react';
import './PortfolioAppList.css';
import { HowDidIMakeThis, PortApp, PortSkill } from '../data/PortApp';
import { PortfolioApp } from './PortfolioApp';
import { remToPx } from '../data/util';
import { App } from '../data/App';

const PORTFOLIO_APP_HEIGHT_REM = 10;
const PORTFOLIO_APP_WIDTH_REM = 6;
const PORTFOLIO_APP_GRID_GAP_REM = 3;
const PORTFOLIO_APP_CONTENT_HEIGHT_REM = 24;
const ANIMATION_DURATION_MS = 300;
const CONTENT_RENDER_DELAY_MS = ANIMATION_DURATION_MS + 10;
const CONTENT_FADE_DURATION_MS = 200;

type SkillLabelRef = { 
  el: HTMLDivElement, 
  side: "left" | "right"
}

type AppRef = {
  el: HTMLDivElement,
}

type SVGPathDirection = { 
  xNext: number,
  yNext: number,
}

export interface IPortfolioAppList {}
export const PortfolioAppList: React.FC<IPortfolioAppList> = () => {
  const [apps] = React.useState(PortApp.getAllApps(PortSkill.getAllSkills()));
  const [appIndexOpen, setAppIndexOpen] = React.useState<number>(-1);
  const [contentIndexToRender, setContentIndexToRender] = React.useState<number>(-1);
  const [contentFadedIn, setContentFadedIn] = React.useState<boolean>(false);
  const [activeSkillIds, setActiveSkillIds] = React.useState<Set<string>>(new Set());
  const [tempActiveSkillIds, setTempActiveSkillIds] = React.useState<Set<string>>(new Set());
  const [focusedAppId, setFocusedAppId] = React.useState<string | null>(null);
  const [activeAppIds, setActiveAppIds] = React.useState<Set<string>>(new Set());
  const [tempActiveAppIds, setTempActiveAppIds] = React.useState<Set<string>>(new Set());
  
  const itemsPerRow = React.useRef<number>(-1);
  const portfolioAppListRef = React.useRef<HTMLDivElement | null>(null);
  const portfolioAppsRef = React.useRef<HTMLDivElement | null>(null);
  const currentAppRef = React.useRef<HTMLDivElement | null>(null);
  const appRefsMap = React.useRef<Map<string, AppRef>>(new Map());
  const skillLabelRefsMap = React.useRef<Map<string, SkillLabelRef>>(new Map());
  const contentTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const HDIMTSkills: PortSkill[] = HowDidIMakeThis.getSkills();
  const HDIMT_onTextHover = HowDidIMakeThis.onTextHover();
  HDIMT_onTextHover.subscribe("PortfolioAppList")

  React.useEffect(() => {
    const onHover: boolean = HDIMT_onTextHover.getValue();
    if (onHover) {
      setTempActiveSkillIds(prev => {
        const newSkills = new Set<string>();
        HDIMTSkills.forEach(skill => newSkills.add(skill.Title))
        return newSkills
      });
    } else {
      removeTempSkillConnections();
    }

  }, [HDIMT_onTextHover.getValue()]);
  
  const onPortfolioAppClick = (e: React.MouseEvent, appId: string, index: number) => {

    // Closing the currently open app
    if (appIndexOpen === index) {
      // Fade out content first
      setContentFadedIn(false);
      setFocusedAppId(null);
      
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
      // Fade out current content first and remove lines
      setContentFadedIn(false);
      
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      
      fadeTimeoutRef.current = setTimeout(() => {
        // Then switch to new app
        currentAppRef.current = e.currentTarget as HTMLDivElement;
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
    currentAppRef.current = e.currentTarget as HTMLDivElement;
    setAppIndexOpen(index);
    setFocusedAppId(appId);
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
    const windowResizeCalculations = () => {
      // Calculate items per row based on container width
      if (portfolioAppsRef.current) {
        const containerWidth = portfolioAppsRef.current.clientWidth + remToPx(PORTFOLIO_APP_GRID_GAP_REM, document);
        const itemWidth = remToPx(PORTFOLIO_APP_WIDTH_REM, document) + (remToPx(PORTFOLIO_APP_GRID_GAP_REM, document));
        const newItemsPerRow = Math.floor(containerWidth / itemWidth);
        itemsPerRow.current = newItemsPerRow;
        setAppIndexOpen(-1);
        setContentIndexToRender(-1);
        setContentFadedIn(false);
      }

      // Redraw lines
      drawAllLines();
    };

    windowResizeCalculations();
    window.addEventListener('resize', windowResizeCalculations);

    return () => {
      window.removeEventListener('resize', windowResizeCalculations);
    };
  }, []);

  // ## Drawing Lines
  const lineContainerRef = React.useRef<HTMLDivElement | null>(null);
  React.useLayoutEffect(() => {
    if (appIndexOpen === -1) {

      // Timeout ensures content is "settled" before drawing lines
      const time = setTimeout(() => {
        drawAllLines();
        clearTimeout(time);
      }, CONTENT_RENDER_DELAY_MS + 10);
    } else {
      removeLines();
    }
  }, [appIndexOpen]);
  React.useLayoutEffect(() => {
    drawAllLines();
  }, [activeSkillIds, tempActiveSkillIds])

  const getAppIndexCoords = (appId: string) => {
    const appIndex = apps.findIndex(a => a.id === appId);
    const appRowIndex = Math.floor(appIndex / (itemsPerRow.current || 1));
    const appColumnIndex = appIndex % (itemsPerRow.current || 1);
    return { appRowIndex, appColumnIndex };
  }

  const removeLines = () => {
    if (lineContainerRef.current) {
      lineContainerRef.current.style.opacity = '0';
      setTimeout(() => {
        if (lineContainerRef.current) {
          lineContainerRef.current.innerHTML = '';
        }
      }, 0);
    }
  }

  const drawAllLines = (noRedraw: boolean = false): void => {
    // No lines for smaller sizes or when context window is open
    removeLines();
    if (window.innerWidth < 768 || lineContainerRef.current === null) {
      return;
    }
    const allLines = allConnections_IdToId.map(([appId, skillId]) => {
      const from = getLabelFromId(skillId);
      const to = getAppFromId(appId);
      return { 
        from, 
        to, 
        leftSide: from?.side === "left",
        active: tempActiveAppIds.has(appId) || 
          focusedAppId === appId ||
          activeSkillIds.has(skillId)
      };
    });

    // Fade in the lines after appending
    setTimeout(() => {
      if (lineContainerRef.current && appIndexOpen === -1) {
        lineContainerRef.current.style.opacity = '1';
        for (const { from, to, leftSide, active } of allLines) {
          const drawnLine = drawLine(
            from?.el ?? null, 
            to?.el ?? null, 
            leftSide, 
            active
          );
          if (drawnLine) {
            lineContainerRef.current.appendChild(drawnLine);
          }
        }
      }
    }, 0);
  }

  const drawLine = (
    fromEl: HTMLElement | null, 
    toEl: HTMLElement | null,
    leftSide: boolean = true,
    active: boolean = false
  ): SVGSVGElement | null => {
    if (fromEl === null || toEl === null) return null;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const outerPortfolioAppListRect = portfolioAppListRef.current?.getBoundingClientRect();
    const innerPortfolioAppsRect = portfolioAppsRef.current?.getBoundingClientRect();

    if (!outerPortfolioAppListRect || !innerPortfolioAppsRect) return null;

    const getPathDirections = (): SVGPathDirection[] => {
      const directions: SVGPathDirection[] = [];
      const { appRowIndex, appColumnIndex } = getAppIndexCoords(toEl.dataset.appId || '');

      const pathFromTheLeft = () => {
        
        let xCurrent = fromRect.right - outerPortfolioAppListRect.left + 10;
        let yCurrent = (fromRect.top + fromRect.height / 2) - outerPortfolioAppListRect.top;

        // Start from the right side in the middle of the label
        directions.push({ xNext: xCurrent, yNext: yCurrent });
        // Move HORIZONTALLY to the left edge of the container
        xCurrent = (innerPortfolioAppsRect?.left ?? 0) - 30;
        directions.push({ xNext: xCurrent, yNext: yCurrent });

        if (appColumnIndex > 0) {
          // Move VERTICALLY to the gap between rows of the target app
          if (appRowIndex >= 2) {
            // If the app is in a lower row, go above it
            yCurrent = (toRect.top - 28) - outerPortfolioAppListRect.top;
          } else {
            // Else go below it
            yCurrent = (toRect.bottom + 20) - outerPortfolioAppListRect.top;
          }
          directions.push({ xNext: xCurrent, yNext: yCurrent });
          // Move HORIZONTALLY to align with the column of the target
          xCurrent = toRect.left - 20 - outerPortfolioAppListRect.left;
          directions.push({ xNext: xCurrent, yNext: yCurrent });
        }
        // Move VERTICALLY to align with the target
        yCurrent = (toRect.top + toRect.height / 2) - 20 - outerPortfolioAppListRect.top;
        directions.push({ xNext: xCurrent, yNext: yCurrent });
        
        // Move HORIZONTALLY to connect to the target
        xCurrent = toRect.left - outerPortfolioAppListRect.left;
        directions.push({ xNext: xCurrent, yNext: yCurrent });

        return directions;
      }
      const pathFromTheRight = () => {
        let xCurrent = fromRect.left - outerPortfolioAppListRect.left - 10;
        let yCurrent = (fromRect.top + fromRect.height / 2) - outerPortfolioAppListRect.top;
        
        // Start from the left side in the middle of the label
        directions.push({ xNext: xCurrent, yNext: yCurrent });
        // Move HORIZONTALLY to the right edge of the container
        xCurrent = (innerPortfolioAppsRect?.right ?? 0) + 10 - outerPortfolioAppListRect.left;
        directions.push({ xNext: xCurrent, yNext: yCurrent });
        
        if (appColumnIndex !== itemsPerRow.current - 1) {
          // Move VERTICALLY to the gap between rows of the target app
          if (appRowIndex >= 2) {
            // If the app is in a lower row, go above it
            yCurrent = (toRect.top - 28) - outerPortfolioAppListRect.top;
          } else {
            // Else go below it
            yCurrent = (toRect.bottom + 20) - outerPortfolioAppListRect.top;
          }
          directions.push({ xNext: xCurrent, yNext: yCurrent });
          // Move HORIZONTALLY to align with the column of the target
          xCurrent = toRect.right + 20 - outerPortfolioAppListRect.left;
          directions.push({ xNext: xCurrent, yNext: yCurrent });
        }
        // Move VERTICALLY to align with the target
        yCurrent = (toRect.top + toRect.height / 2) - 20 - outerPortfolioAppListRect.top;
        directions.push({ xNext: xCurrent, yNext: yCurrent });
        // Move HORIZONTALLY to the target
        xCurrent = toRect.right - outerPortfolioAppListRect.left + 5;
        directions.push({ xNext: xCurrent, yNext: yCurrent });

        return directions;

      }

      return leftSide ? pathFromTheLeft() : pathFromTheRight();
    }

    const convertPathDirectionsToSVGPath = (directions: SVGPathDirection[]): string => {
      if (directions.length === 0) return '';
      
      var pathD = '';
      for (let i = 0; i < directions.length; i++) {
        if (i === 0) {
          pathD = `M ${directions[i].xNext} ${directions[i].yNext} `;
        }
        else {
          pathD += `L ${directions[i].xNext} ${directions[i].yNext} `;
        }
      }
      return pathD;
    }
  
    const newPathString = convertPathDirectionsToSVGPath(getPathDirections());

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', '100%');
    svgEl.style.position = 'absolute';
    svgEl.style.top = '0';
    svgEl.style.left = '0';
    svgEl.style.zIndex = active ? '3' : '2';
    svgEl.classList.value = `drawline ${active ? 'active' : 'inactive'}`;

    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newPath.setAttribute('d', newPathString);
    newPath.setAttribute('fill', 'transparent');
    newPath.setAttribute('stroke-width', '2'); 

    svgEl.appendChild(newPath);
    return svgEl;
  };

  const getAppFromId = (id: string): AppRef | null => {
    return appRefsMap.current.get(id) || null;
  }
  const getLabelFromId = (id: string): SkillLabelRef | null => {
    return skillLabelRefsMap.current.get(id) || null;
  }
  const skillsToAppIdMap: Map<string, Set<string>> = React.useMemo(() => {
    const mappers: Map<string, Set<string>> = new Map();
    
    apps.forEach(app => {
      app.Skills.forEach(skill => {
        if (!mappers.has(skill.Title)) {
          mappers.set(skill.Title, new Set());
        }
        mappers.get(skill.Title)?.add(app.id);
      })
    });
    return mappers;
  }, [apps]);
  const allConnections_IdToId: [string, string][] = React.useMemo(() => {
    const tuples: [string, string][] = [];

    apps.forEach(app => {
      app.Skills.forEach(skill => {
        tuples.push([app.id, skill.Title]);
      })
    });
    return tuples;
  }, []);

  const applyAndLogic = (notLogic: boolean) => {
    const localActiveAppIds = new Set<string>();
    for (const app of apps) {
      if (app.Skills.length === 0) {
        continue;
      }

      // Only if the apps skills are the same as active skills, add it
      if (app.Skills.every(appSkill => 
          Array.from(activeSkillIds).includes(appSkill.Title))) {
            if (!notLogic) {
              localActiveAppIds.add(app.id);
            }
      } else if (notLogic) {
        localActiveAppIds.add(app.id);
      }
    }
    setActiveAppIds(localActiveAppIds);
  }
  const applyOrLogic = (notLogic: boolean) => {
    const localActiveAppIds = new Set<string>();
    const antiActiveAppIdsLocal = new Set<string>();
    for (const app of apps) {
      if (notLogic && app.Skills.length === 0) {
        localActiveAppIds.add(app.id);
      }

      const appSkills = app.Skills.map(s => s.Title);
      for (const appSkill of appSkills) {
        if (!notLogic) {
          if (activeSkillIds.has(appSkill)) {
            localActiveAppIds.add(app.id);  
          }
        } else {
          if (activeSkillIds.has(appSkill)) {
            localActiveAppIds.delete(app.id);
            antiActiveAppIdsLocal.add(app.id);
          } else if (!antiActiveAppIdsLocal.has(app.id)) {
            localActiveAppIds.add(app.id);
          }
        }
      }
    }
    setActiveAppIds(localActiveAppIds);
  }
  React.useEffect(() => {
    if (App.Instance.AndLogic) {
      applyAndLogic(App.Instance.NotLogic);
    } else {
      applyOrLogic(App.Instance.NotLogic);
    }
  }, [App.Instance.NotLogic, App.Instance.AndLogic, activeSkillIds]);

  const toggleSkillActive = (skill: string) => {
    setActiveSkillIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skill)) {
        newSet.delete(skill);
      } else {
        newSet.add(skill);
      }
      return newSet;
    });
  }
  const removeTempSkillConnections = () => {
    setTempActiveSkillIds(new Set());
  }
  const connectTempSkillsToApp = (appId: string, newConnections?: boolean) => {
    setTempActiveSkillIds(prev => {
      const newSet = newConnections ? new Set<string>() : new Set(prev);
      for (const skill of Array.from(skillsToAppIdMap.keys())) {
        if (skillsToAppIdMap.get(skill)?.has(appId)) {
          if (!newSet.has(skill)) {
            newSet.add(skill);
          }
        }
      }
      return newSet;
    })
  }

  const addTempAppId = (appId: string) => {
    setTempActiveAppIds(prev => {
      const newSet = new Set(prev);
      newSet.add(appId);
      return newSet;
    });
    connectTempSkillsToApp(appId);
  }
  const removeTempAppId = (appId: string) => {
    setTempActiveAppIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(appId);
      return newSet;
    });
    removeTempSkillConnections();
  }

  const createSkillLabels = () => {
    const onLabelClick = (skill: string) => {
      if (appIndexOpen !== -1) return;
      toggleSkillActive(skill);
    }
    const leftLabels = Array.from(skillsToAppIdMap.entries())
      .filter(({}, index) => index % 2 === 0);
    const rightLabels = Array.from(skillsToAppIdMap.entries())
      .filter(({}, index) => index % 2 !== 0);
    
    return (
      <div className="labels-container">
        <div className="LeftSkillLabels">
          {leftLabels.map(([skill]) => {
            let isActive = focusedAppId === null ?
              activeSkillIds.has(skill) || tempActiveSkillIds.has(skill) : 
              tempActiveSkillIds.has(skill);

            return (
              <div
              className={`PortfolioSkillLabel ${isActive ? 'active' : 'inactive'}`}
              key={skill}
              ref={ref => skillLabelRefsMap.current.set(skill, 
                { el: ref!, side: "left" })}
                data-label-id={skill}
                onClick={() => onLabelClick(skill)}
                >
                <h3 className={`unselectable`}>{skill}</h3>
              </div>
            )
          })}
        </div>
        <div className="RightSkillLabels">
          {rightLabels.map(([skill]) => {
            let isActive = focusedAppId === null ?
              activeSkillIds.has(skill) || tempActiveSkillIds.has(skill) : 
              tempActiveSkillIds.has(skill);

            return (
              <div
                className={`PortfolioSkillLabel ${isActive ? 'active' : 'inactive'}`}
                key={skill}
                ref={ref => skillLabelRefsMap.current.set(skill,
                    { el: ref!, side: "right" })}
                data-label-id={skill}
                onClick={() => onLabelClick(skill)}
              >
                <h3 className={`unselectable`}>{skill}</h3>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div 
      className='PortfolioAppList' 
      ref={ref => portfolioAppListRef.current = ref}
    >
      <div
        className="LineContainer"
        ref={lineContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 1,
          transition: `0.2s`,
        }}
      />
      <div 
        className="AppList"
        onScroll={() => drawAllLines()}
      >
        <div 
          className="PortfolioApps" 
          style={{ 
            gridGap: `${PORTFOLIO_APP_GRID_GAP_REM}rem`,
            position: 'relative',
          }}
          ref={portfolioAppsRef}
        >
          {apps.map((app, index) => {
            const appOpen = appIndexOpen === index;
            const topPosition = currentAppRef.current ? 
              currentAppRef.current.offsetTop +  // The top of the app
              remToPx(PORTFOLIO_APP_HEIGHT_REM, document)  // The height of the app
              : 0;

            let isAppActive 
            if (focusedAppId === null) {
              isAppActive = activeAppIds.has(app.id) || 
                tempActiveAppIds.has(app.id) ||  
                focusedAppId === app.id ||
                appOpen;

            } else {
              isAppActive = focusedAppId === app.id ? true : false;
            }

            return <div 
              className={`PortfolioAppWrapper`}
              key={app.id}
              style={{
                maxWidth: `${PORTFOLIO_APP_WIDTH_REM}rem`,
                height: `${PORTFOLIO_APP_HEIGHT_REM}rem`,
                marginBottom: indexInRange(index, appIndexOpen, itemsPerRow.current) ? `${PORTFOLIO_APP_CONTENT_HEIGHT_REM}rem` : `0`,
              }}
              ref={ref => {
                if (ref) {
                  if (appOpen) {
                    currentAppRef.current = ref;
                  }
                  appRefsMap.current.set(app.id, {el: ref});
                } else {
                  appRefsMap.current.delete(app.id);
                }
              }}
              onMouseEnter={() => appIndexOpen === -1 ? addTempAppId(app.id) : null}
              onMouseLeave={() => appIndexOpen === -1 ? removeTempAppId(app.id) : null}
              data-app-id={app.id}
              data-app-name={app.Title}
            >
              <PortfolioApp 
                key={app.id} 
                app={app}
                className={isAppActive ? 'active' : 'inactive'}
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
                      width: '99%', // at `100%` it clips off the page in some cases
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
      {createSkillLabels()}
    </div>
  );
};
