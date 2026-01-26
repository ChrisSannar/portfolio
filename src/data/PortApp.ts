import { generateId } from './util';

export class PortApp {
    public readonly id: string;

    constructor(public readonly Title: string) {
        this.id = generateId();
    }

    static getAllApps(): PortApp[] {
        return [
            new PortApp('ASDFASDF ASDF ASDFASDFASDF'),
            new PortApp('ASDF2'),
            new PortApp('QWER'),
            new PortApp('QWER2'),
            new PortApp('ZXCV'),
            new PortApp('ZXCV2'),
            new PortApp('ZXCV3'),
            new PortApp('ZXCV4'),
            new PortApp('ZXCV5'),
            new PortApp('ZXCV6'),
            new PortApp('ZXCV7'),
            new PortApp('ZXCV8'),
        ];
    }
}