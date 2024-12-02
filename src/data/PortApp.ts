import { generateId } from './util';

export class PortApp {
    public readonly id: string;

    constructor(public readonly Title: string) {
        this.id = generateId();
    }

    static getAllApps(): PortApp[] {
        return [
            new PortApp('ASDF'),
            new PortApp('ASDF2'),
            new PortApp('QWER'),
            new PortApp('QWER2'),
            new PortApp('ZXCV'),
            new PortApp('ZXCV2'),
            new PortApp('ZXCV3'),
        ];
    }
}