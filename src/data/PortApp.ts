import { generateId } from './util';

export class PortApp {
    public readonly id: string;

    constructor(
        public readonly Title: string,
        public readonly Skills: PortSkill[] = [],
        public readonly Description: string = '',
        public readonly ImageUrl: string = '',
        public readonly AppUrl: string = '',
        public readonly RepoUrl: string = ''
    ) {
        this.id = generateId();
    }

    static getAllApps(skills: PortSkill[]): PortApp[] {
        return [
            new PortApp(
                'ASDFASDF ASDF ASDFASDFASDF', 
                [skills[0], skills[1]],
                'This is a description for ASDFASDF ASDF ASDFASDFASDF', 
                '', 
                'https://example.com/app1', 
            ),
            new PortApp(
                'ASDF2',
                [skills[1], skills[2]],
                'This is a description for ASDF2', 
                '', 
                'https://example.com/app2', 
                ''
            ),
            new PortApp('QWER'),
            new PortApp(
                'QWER2',
                [],
                'This is a description for QWER2',
            ),
            new PortApp(
                'ZXCV',
                [skills[2]],
                'This is a description for ZXCV',
            ),
            new PortApp('ZXCV2'),
            new PortApp('ZXCV3'),
            new PortApp('ZXCV4'),
            new PortApp(
                'ZXCV5',
                [skills[0], skills[3]],
            ),
            new PortApp('ZXCV6'),
            new PortApp('ZXCV7'),
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
            new PortSkill('JavaScript', [
            ]),
            new PortSkill('TypeScript', [
            ]),
            new PortSkill('React', [
            ]),
            new PortSkill('CSS', [
            ]),
        ];
    }
}