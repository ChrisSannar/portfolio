import { hotProperty, IHotProperty } from './hotProperty';
import { generateId } from './util';

export class PortApp {
    public readonly id: string;

    constructor(
        public readonly Title: string,
        public readonly Skills: PortSkill[] = [],
        public readonly Description: string = '',
        public readonly ImageUrl: string = '',
        public readonly AppUrl: string = '',
        public readonly RepoUrl: string = '',
        public readonly Timeline: string = '',
        public readonly Body: string = '',
    ) {
        this.id = generateId();
    }

    static getAllApps(skills: PortSkill[]): PortApp[] {
        // TODO: ***TEMP*** Remove after implementing real data
        const getRandomSkills = (allSkills: PortSkill[], count: number) => {
            const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        return [
            new PortApp(
                'UVU',
                getRandomSkills(skills, 2),
                'Bachelors of Computer Science from Utah Valley University',
                '',
                '',
                '',
                '(May 2019)',
                `Intermediate to advanced computer science concepts, including algorithms, data structures, and software development, with a strong focus on networking principles, protocols, and implementation.`,
            ),
            new PortApp(
                'ASDFASDF ASDF ASDFASDFASDF', 
                getRandomSkills(skills, 3),
                'This is a description for ASDFASDF ASDF ASDFASDFASDF', 
                '', 
                'https://example.com/app1', 
            ),
            new PortApp(
                'ASDF2',
                [],
                'This is a description for ASDF2', 
                '', 
                'https://example.com/app2', 
                ''
            ),
            new PortApp('QWER', getRandomSkills(skills, 1)),
            new PortApp(
                'QWER2',
                [],
                'This is a description for QWER2',
            ),
            new PortApp(
                'ZXCV',
                getRandomSkills(skills, 2),
                'This is a description for ZXCV',
            ),
            new PortApp('ZXCV2', getRandomSkills(skills, 3)),
            new PortApp('ZXCV3', getRandomSkills(skills, 1)),
            new PortApp('ZXCV4'),
            new PortApp('ZXCV5', getRandomSkills(skills, 3)),
            new PortApp('ZXCV6'),
            new PortApp('ZXCV7', getRandomSkills(skills, 2)),
            new PortApp('ZXCV8'),
        ];
    }
}

export class PortSkill {
    constructor(
        public readonly Title: string,
        public readonly AppTitles: string[] = []
    ) {}

    static getAllSkills(): PortSkill[] {
        return [
            new PortSkill('JavaScript', []),
            new PortSkill('TypeScript', []),
            new PortSkill('React', []),
            new PortSkill('CSS', []),
            new PortSkill('Node.js', []),
            new PortSkill('Express', []),
            new PortSkill('MongoDB', []),
            new PortSkill('PostgreSQL', []),
            new PortSkill('HTML', []),
            new PortSkill('Vue.js', []),
        ];
    }
}

export const HDIMT_TEXT_HOVER = "HDIMT_TEXT_HOVER"; 
export class HowDidIMakeThis {
    
    public static getSkills(): PortSkill[] {
        return [...PortSkill.getAllSkills()];
    }

    public static onTextHover(): IHotProperty<boolean> {
        
        return hotProperty<boolean>(false, HDIMT_TEXT_HOVER);
    }
}