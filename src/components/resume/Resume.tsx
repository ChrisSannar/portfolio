import * as React from 'react';
import './Resume.css';

import markdownIt from 'markdown-it-ts';
import { Token } from 'markdown-it';

import { App, ColorModeType } from '../../data/App';
import { MDParser } from './MDParser';
import { TerminalInput } from './TerminalInput';

import mailIcon from '../../assets/mail-icon.svg';
import githubIcon from '../../assets/github-icon.svg';
import linkedinIcon from '../../assets/linkedin-icon.svg';
import nightIcon from '../../assets/night-icon.svg';
import dayIcon from  '../../assets/day-icon.svg';

import resumeMDFile from '../../assets/Resume.md';
import resumePDFFile from '../../assets/001-Chris-Sannar-Resume.pdf';

interface IResume {

}

export const Resume: React.FC<IResume> = () => {
    const app = App.getHotInstance().subscribe('PortfolioFooter');
    const [parsedTokens, setParsedTokens] = React.useState<Token[]>([]);
    
    React.useEffect(() => {
        fetch(resumeMDFile)
            .then(response => response.text())
            .then(resumeContent => {
                const md = markdownIt()
                const tokens = md.parse(resumeContent);
                setParsedTokens(tokens);
            })
            .catch(error => {
                console.error('Error fetching resume content:', error);
            });
    }, []);

    const darkMode = app?.ColorMode === ColorModeType.DARK;
    
    return <div className="Resume" onClick={e => console.log(e.target)}>
        <div className="resume-content">
            <MDParser tokens={parsedTokens} />
        </div>
        <div className="footer">
            <div className="footer-left contact">
                <div className="contact-icons">
                    <div className="contact-icon">
                        <a href="mailto:chris.sannar.dev@gmail.com" target="_blank"  rel="noopener noreferrer">
                            <img src={mailIcon} alt="mail-icon" />
                        </a>
                    </div>
                    <div className="contact-icon">
                        <a href="https://github.com/ChrisSannar" target="_blank"  rel="noopener noreferrer">
                            <img src={githubIcon} alt="github-icon" />
                        </a>
                    </div>
                    <div className="contact-icon">
                        <a href="https://www.linkedin.com/in/christopher-sannar-8753ab9a/" target="_blank"  rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="linkedin-icon" />
                        </a>
                    </div>
                </div>
            </div>
            <div className='footer-center'>
                <div className="terminal-input">
                    <TerminalInput />
                </div>
            </div>
            <div className="footer-right">
                <div className="contact-icon">
                    <a className="resume-button" href={resumePDFFile} download="001-Chris-Sannar-Resume.pdf">
                        <p>PDF</p>
                    </a>
                </div>
                <div className="color-mode" onClick={() => App.toggleColorMode()}>
                    <div className={`night logic-selected`}>
                        <img src={nightIcon} alt="night-mode" />
                    </div>
                    <div className={`day`}>
                        <img src={dayIcon} alt="day-mode" />
                    </div>
                    <div className="color-mode-selector" style={{ transform: `translateX(${darkMode ? '0' : '155'}%)`}} />
                </div>
            </div>
        </div>
    </div>
}
