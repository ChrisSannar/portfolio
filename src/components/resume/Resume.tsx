import * as React from 'react';
import './Resume.css';

interface IResume {

}

export const Resume: React.FC<IResume> = () => {
    return <div className="Resume">
        <h1>Resume</h1>
        {/* Add "call to action": Contact, etc. */}
        <About />
        <Skills />
        <Experience />
        <Education />
        <Contact />
    </div>
}

const About: React.FC = () => {
    return <div className="About">
        <h2>About</h2>
        {/* 
            Next points:
             - I've been coding for over a decade now
             - Have 5 years of professional experience
             - Emphasize on web development and networking
             - I'm particularly good at teaching and want to build platforms to encourage education in computer science
        */}
    </div>
}

const Skills: React.FC = () => {
    return <div className="Skills">
        <h2>Skills</h2>
    </div>
}

const Experience: React.FC = () => {
    return <div className="Experience">
        <h2>Experience</h2>
    </div>
}

const Education: React.FC = () => {
    return <div className="Education">
        <h2>Education</h2>
    </div>
}

const Contact: React.FC = () => {
    return <div className="Contact">
        <h2>Contact</h2>
    </div>
}
