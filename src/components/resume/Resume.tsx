import * as React from 'react';
import './Resume.css';

interface IResume {

}

export const Resume: React.FC<IResume> = () => {
    return <div className="Resume">
        <div className="resume-content">
            {/* Add "call to action": Contact, etc. */}
            <About />
            <Skills />
            <Experience />
            <Education />
        </div>
    </div>
}

const About: React.FC = () => {
    const [viewContent, setViewContent] = React.useState(true);
    return <div className="About">
        <div className="title" onClick={() => setViewContent(view => !view)}>
            <h2>About</h2>
        </div>
        {viewContent &&
            <div className="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, reprehenderit? Labore reprehenderit, libero blanditiis aliquid natus veniam cum magni excepturi deleniti quaerat, maiores nobis dolor ut, omnis dolorum fugit nesciunt?</p>
                {/* 
                    Next points:
                     - I've been coding for over a decade now
                     - Have 5 years of professional experience
                     - Emphasize on web development and networking
                     - I've worked on dozens of project with AI/LLMs: Know how to leverage the technology, but still understand the fundamentals
                     - I'm particularly good at teaching and want to build platforms to encourage education in computer science
                */}
            </div>
        }
    </div>
}

const Skills: React.FC = () => {
    const [viewContent, setViewContent] = React.useState(true);
    return <div className="Skills">
        <div className="title" onClick={() => setViewContent(view => !view)}>
            <h2>Skills</h2>
        </div>
        {viewContent && 
            <div className="content">
                <p>Content</p>

            </div>
        }
    </div>
}

const Experience: React.FC = () => {
    const [viewContent, setViewContent] = React.useState(true);
    return <div className="Experience">
        <div className="title" onClick={() => setViewContent(view => !view)}>
            <h2>Experience</h2>
        </div>
        {viewContent && 
            <div className="content">
                <p>Content</p>

            </div>
        }
    </div>
}

const Education: React.FC = () => {
    const [viewContent, setViewContent] = React.useState(true);
    return <div className="Education">
        <div className="title" onClick={() => setViewContent(view => !view)}>
            <h2>Education</h2>
        </div>
        {viewContent && 
            <div className="content">
                <p>Content</p>

            </div>
        }
    </div>
}

