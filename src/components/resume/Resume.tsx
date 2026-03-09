import * as React from 'react';
import './Resume.css';

import markdownIt from 'markdown-it-ts';
import { Token } from 'markdown-it';

import { MDParser } from './MDParser';

import mailIcon from '../../assets/mail-icon.svg';
import linkedinIcon from '../../assets/linkedin-icon.svg';
import resumeMDFile from '../../assets/Resume.md';

interface IResume {

}

export const Resume: React.FC<IResume> = () => {
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
    }, [])

    return <div className="Resume">
        <div className="resume-content">
            {/* Add "call to action": Contact, etc. */}
            <MDParser tokens={parsedTokens} />
        </div>
        <div className="contact">
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
            </div>
        </div>
    </div>
}
