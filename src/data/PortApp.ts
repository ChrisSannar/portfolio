import { hotProperty, IHotProperty } from './hotProperty';
import { generateId } from './util';

// App imports
import uvuIcon from '../assets/app_data/uvu-icon.svg';
import uvuIconDark from '../assets/app_data/uvu-icon-dark.svg';
import uvuBody from '../assets/app_data/uvu-body.jpg';

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
                PortSkill.getSkillsByTitles(['TypeScript', 'Java', 'C++', 'WebDev', 'Networking']),
                `Intermediate to advanced computer science concepts, including algorithms, data structures, and software development, with a strong focus on networking principles, protocols, and implementation.`,
                {
                    appIcon: uvuIcon,
                    appIconDark: uvuIconDark,
                    bodyImage: uvuBody,
                },
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
        public readonly AppTitles: string[] = []
    ) {}

    static getSkillsByTitles(titles: string[]): PortSkill[] {
        return this.getAllSkills().filter(s => titles.includes(s.Title));
    }

    static getAllSkills(): PortSkill[] {
        return [
            new PortSkill('TypeScript', null, []),
            new PortSkill('Java', null, []),
            new PortSkill('C++', null, []),
            new PortSkill('WebDev', 'Web Development', []),
            new PortSkill('Networking', null, []),
            new PortSkill('React', null, []),
            new PortSkill('AI/LLM', null, []),
            // new PortSkill('MongoDB', []),
            // new PortSkill('PostgreSQL', []),
            // new PortSkill('Vue.js', []),
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