import React from 'react';

import './PortfolioFooter.css';
import nightIcon from '../assets/night-icon.svg';
import dayIcon from  '../assets/day-icon.svg';
import mailIcon from '../assets/mail-icon.svg';
import linkedinIcon from '../assets/linkedin-icon.svg';
import figmaIcon from '../assets/figma-icon.svg';
import { App, ColorModeType } from '../data/App';
import { HowDidIMakeThis } from '../data/PortApp';

export const PortfolioFooter: React.FC = () => {
    const [thisActive, setThisActive] = React.useState(false);
    const app = App.getHotInstance().subscribe('PortfolioFooter');
    const notLogic = app.NotLogic;
    const andLogic = app.AndLogic;
    const darkMode = app.ColorMode === ColorModeType.DARK;

    const toggleTextHover = () => {
        HowDidIMakeThis.onTextHover().setFunc(val => !val);
    }

    React.useEffect(() => {
        HowDidIMakeThis.onTextHover().setFunc(val => thisActive);
    }, [thisActive])

    return (
        <div className='PortfolioFooter'>
            <div className='left'>
                <h3 className={`unselectable`}>Contact</h3>
                <div className="contact-info">
                    <p><a href="mailto:chris.sannar.dev@gmail.com">chris.sannar.dev@gmail.com</a></p>
                    <p><a href="https://www.linkedin.com/in/christopher-sannar-8753ab9a/" target="_blank">LinkedIn</a></p>
                </div>
                <div className="contact-icons">
                    <div className="contact-icon">
                        <a href="mailto:chris.sannar.dev@gmail.com" target="_blank">
                            <img src={mailIcon} alt="mail-icon" />
                        </a>
                    </div>
                    <div className="contact-icon">
                        <a href="https://www.linkedin.com/in/christopher-sannar-8753ab9a/" target="_blank">
                            <img src={linkedinIcon} alt="linkedin-icon" />
                        </a>
                    </div>
                    <div className="contact-icon">
                        <a href="https://www.figma.com/design/EZDHetesbURTQLlJsXgfSc/Portfolio-Website?node-id=0-1&t=Q4gvL3UdeWz2zobn-1" target='_blank'>
                            <img src={figmaIcon} alt="figma-icon" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="center">
                <h4 
                    className={`HDIMT unselectable`}
                    onMouseEnter={() => toggleTextHover()}
                    onMouseLeave={() => toggleTextHover()}
                >How did I make this?</h4>
            </div>
            <div className="right unselectable">
                <div className="this">
                    <p
                        className={`this-text ${thisActive ? 'active' : ''}`} 
                        onClick={() => setThisActive(prev => !prev)}
                    >This?</p>
                </div>
                <div className="logic">
                    <div className="and-or" onClick={() => App.toggleAndLogic()}>
                        <p className={`and ${andLogic ? 'logic-selected' : ''}`}>AND</p>
                        <p className={`or ${andLogic ? '' : 'logic-selected'}`}>OR</p>
                        <div className="and-or-selector" style={{ transform: `translateX(${andLogic ? '-10%' : '90%'})` }} />
                    </div>
                    <div className="not" onClick={() => App.toggleNotLogic()}>
                        <p className={notLogic ? `logic-selected` : ''}>NOT</p>
                        <div className='not-selector' style={{ opacity: notLogic ? '1' : '0'}} />
                    </div>
                </div>
                <div className="color-mode" onClick={() => App.toggleColorMode()}>
                    <div className={`night logic-selected`}>
                        <img src={nightIcon} alt="night-mode" />
                    </div>
                    <div className={`day`}>
                        <img src={dayIcon} alt="day-mode" />
                    </div>
                    <div className="color-mode-selector" style={{ transform: `translateX(${darkMode ? '0' : '129'}%)`}} />
                </div>
            </div>
        </div>
    );
};
