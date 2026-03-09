import * as React from 'react';
import './Resume.css';

import markdownIt from 'markdown-it-ts';

// import resumeContent from '../../assets/Resume.md';

interface IResume {

}

export const Resume: React.FC<IResume> = () => {
    
    React.useEffect(() => {
        fetch('/assets/Resume.md')
            .then(response => response.text())
            .then(resumeContent => {
                const md = markdownIt()
                const tokens = md.parse(resumeContent);
                console.log(tokens);
            })
            .catch(error => {
                console.error('Error fetching resume content:', error);
            });
    }, [])

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

const ABOUT_TEXT: string = 
    `With over a decade of coding experience and five years working professionally, ` +
    `I specialize in web development, networking, and building educational applications.` 
const ABOUT_TEXT_2: string =
    `Having many years of experience working before, and after, the popularization of LLM models, ` + 
    `I know how to leverage AI in development yet still have a strong understanding of the fundamentals.`
const ABOUT_TEXT_3: string =
    `I have a passion for teaching, love making content to help others learn computer science.`

const About: React.FC = () => {
    const [viewContent, setViewContent] = React.useState(true);
    return <div className="About">
        <div className="title" onClick={() => setViewContent(view => !view)}>
            <h2>About</h2>
        </div>
        {viewContent &&
            <div className="content">
                <p>
                    {ABOUT_TEXT}
                </p>
                <br />
                <p>
                    {ABOUT_TEXT_2}
                </p>
                <br />
                <p>
                    {ABOUT_TEXT_3}
                </p>    
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

