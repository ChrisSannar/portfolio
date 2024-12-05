import { IHotProperty, hotProperty } from "./hotProperty";

export enum ColorModeType {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export class App {
    public get ColorMode() {
        return this.colorMode;
    }
    private colorMode: ColorModeType = ColorModeType.DARK;

    // static toggleColorMode() {
    //     const currentMode = App.Instance.colorMode;
    //     App.getHotInstance().setFunc((app) => {
    //         app.colorMode = currentMode === ColorModeType.LIGHT ? ColorModeType.DARK : ColorModeType.LIGHT;
    //         return app;
    //     });
    // }

    // static get Instance(): App {
    //     return App.getHotInstance().getValue();
    // }

    // static getHotInstance(): IHotProperty<App> {
    //     return hotProperty<App>(new App(), 'App')
    // }
}