import { hotProperty, IHotProperty } from './hotProperty';
import { generateId } from './util';

// App imports
import uvuIcon from '../assets/app_data/uvu-icon.svg';
import uvuIconDark from '../assets/app_data/uvu-icon-dark.svg';
import uvuBody from '../assets/app_data/uvu-body.jpg';

import comptiaIcon from '../assets/app_data/comptia-icon.webp'
import comptiaIconDark from '../assets/app_data/comptia-icon-dark.png'
// TODO: comptiaBody

import twoUIcon from '../assets/app_data/2U-icon.png'
import twoUIconDark from '../assets/app_data/2U-icon-dark.png'
// TODO: twoUBody

import eliteRoofingIcon from '../assets/app_data/elite-roofing-icon.png'
import eliteRoofingIconDark from '../assets/app_data/elite-roofing-icon-dark.png'
// TODO: twoUBody


interface PortAppImages {
    appIcon?: string;
    appIconDark?: string;
    bodyImage?: string;
}
export class PortApp {
    public readonly id: string;

    constructor(
        public readonly Title: string,
        public readonly Timeline: string = '',
        public readonly Description: string = '',
        public readonly Skills: PortSkill[] = [],
        public readonly Body: string = '',
        public readonly Images: PortAppImages = {},
        public readonly AppUrl: string = '',
        public readonly RepoUrl: string = '',
    ) {
        this.id = generateId();
    }

    static getAllApps(skills: PortSkill[]): PortApp[] {

        return [
            new PortApp(
                'UVU', 
                '(May 2019)',
                'Bachelors of Computer Science: Networking Emphasis from Utah Valley University',
                PortSkill.getSkillsByTitles([
                    'TypeScript', 
                    'Java', 
                    'C++', 
                    'Python',
                    'WebDev', 
                    'Networking'
                ]),
                `Intermediate to advanced computer science concepts, including algorithms, data structures, and software development, with a strong focus on networking principles, protocols, and implementation.`,
                {
                    appIcon: uvuIcon,
                    appIconDark: uvuIconDark,
                    bodyImage: uvuBody,
                },
                '',
            ),
            new PortApp(
                'CompTIA',  
                '(Mar 2021 - Jan 2025)',
                'Software Engineer II',
                PortSkill.getSkillsByTitles([
                    'TypeScript', 
                    'WebDev', 
                    'Networking', 
                    'React',
                    'Node.js',
                    'AI/LLM',
                    'DevOps',
                    'SE'
                ]),
                `Designed and built large-scale educational simulation software replicating real-world Windows, Linux, and enterprise networking environments. Architected robust, highly modular systems that mimicked operating systems, networking stacks, and security infrastructure with production-level fidelity. Focused on scalability, flexibility, and long-term maintainability across complex codebases. Worked across the full stack using TypeScript, React, and Node.js. Contributed to CI/CD pipelines (Bitbucket YAML), Agile workflows (Jira), and modern AI-assisted development practices. Collaborated cross-functionally to translate real-world IT infrastructure into interactive, browser-based simulation platforms used for technical training and certification preparation.`,
                {
                    appIcon: comptiaIcon,
                    appIconDark: comptiaIconDark,
                    // bodyImage: comptiaBody,
                },
                '',
            ),
            new PortApp(
                '2U',
                '(Mar 2020 - May 2021)',
                'Teaching Assistant / Tutor',
                PortSkill.getSkillsByTitles([
                    'TypeScript',
                    'React',
                    'WebDev', 
                    'Node.js',
                    'MongoDB',
                    'MySQL',
                    'Networking',
                ]),
                `Mentored and instructed students in full-stack web development, covering front-end architecture, back-end API design, database modeling, and networking fundamentals. Guided learners through debugging complex application issues, reinforcing core principles such as HTTP lifecycle, server architecture, RESTful design, and state management. Provided code reviews, architectural feedback, and real-time troubleshooting support across JavaScript, React, Node.js, Express, MongoDB, and MySQL stacks. Strengthened communication, technical leadership, and systems-thinking skills by translating complex engineering concepts into practical, production-ready implementations.`,
                {
                    appIcon: twoUIcon,
                    appIconDark: twoUIconDark,
                    // bodyImage: twoUBody,
                },
                '',
                '',
            ),
            new PortApp(
                'Elite Roofing',
                '(Aug 2017 - Nov 2018)',
                'Junior Full-Stack Developer',
                PortSkill.getSkillsByTitles([
                    'TypeScript',
                    'WebDev',
                    'Node.js',
                    'MongoDB',
                    'SE',
                ]),
                `Contributed to the design and development of a production full-stack web application used to generate and manage construction work order estimates. Built and maintained features across the MEAN stack (Angular 6, Node.js, Express, MongoDB), collaborating with engineers and stakeholders to translate business requirements into scalable technical solutions. Implemented RESTful APIs, dynamic form workflows, and database integrations while improving usability through iterative UI/UX refinements. Participated in Agile sprints, version control workflows (Git), and cloud deployment via Heroku, gaining hands-on experience delivering real-world software from development to production.`,
                {
                    // Add images if available
                    appIcon: eliteRoofingIcon,
                    appIconDark: eliteRoofingIconDark,
                    // bodyImage: eliteBody,
                },
                '',
                '',
            ),
            // new PortApp(
            //     'ASDFASDF ASDF ASDFASDFASDF', 
            //     getRandomSkills(skills, 3),
            //     'This is a description for ASDFASDF ASDF ASDFASDFASDF', 
            //     '', 
            //     'https://example.com/app1', 
            // ),
            // new PortApp(
            //     'ASDF2',
            //     [],
            //     'This is a description for ASDF2', 
            //     '', 
            //     'https://example.com/app2', 
            //     ''
            // ),
            // new PortApp('QWER', getRandomSkills(skills, 1)),
            // new PortApp(
            //     'QWER2',
            //     [],
            //     'This is a description for QWER2',
            // ),
            // new PortApp(
            //     'ZXCV',
            //     getRandomSkills(skills, 2),
            //     'This is a description for ZXCV',
            // ),
            // new PortApp('ZXCV2', getRandomSkills(skills, 3)),
            // new PortApp('ZXCV3', getRandomSkills(skills, 1)),
            // new PortApp('ZXCV4'),
            // new PortApp('ZXCV5', getRandomSkills(skills, 3)),
            // new PortApp('ZXCV6'),
            // new PortApp('ZXCV7', getRandomSkills(skills, 2)),
            // new PortApp('ZXCV8'),
        ];
    }
}

export class PortSkill {
    constructor(
        public readonly Title: string,
        public readonly FullName: string | null = '',
    ) {}

    static getSkillsByTitles(titles: string[]): PortSkill[] {
        return this.getAllSkills().filter(s => titles.includes(s.Title));
    }

    static getAllSkills(): PortSkill[] {
        return [
            new PortSkill('TypeScript', 'JavaScript/TypeScript'),
            new PortSkill('Java', null),
            new PortSkill('C++', null),
            new PortSkill('Python', null),
            new PortSkill('WebDev', 'Web Development'),
            new PortSkill('Networking', null),
            new PortSkill('React', null),
            new PortSkill('Node.js', 'Node + Express'),
            new PortSkill('AI/LLM', null),
            new PortSkill('DevOps', 'Bitbucket/YML'),
            new PortSkill('MySQL', null),
            new PortSkill('MongoDB', null),
            new PortSkill('SE', 'SE'),
            // new PortSkill('Vue.js'),
        ];
    }
}

export const HDIMT_TEXT_HOVER = "HDIMT_TEXT_HOVER"; 
export class HowDidIMakeThis {
    
    public static getSkills(): PortSkill[] {
        return PortSkill.getSkillsByTitles(['TypeScript', 'WebDev', 'Networking', 'React']);
    }

    public static onTextHover(): IHotProperty<boolean> {
        
        return hotProperty<boolean>(false, HDIMT_TEXT_HOVER);
    }
}