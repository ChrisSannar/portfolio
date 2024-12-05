import { IHotProperty, hotProperty } from "./hotProperty";

export enum ColorModeType {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export class App {
    public ColorMode: ColorModeType = ColorModeType.DARK;

    static toggleColorMode() {
        const currentMode = App.Instance.ColorMode;
        App.getHotInstance().setFunc((app) => {
            app.ColorMode = currentMode === ColorModeType.LIGHT ? ColorModeType.DARK : ColorModeType.LIGHT;
            return app;
        });
    }

    static get Instance(): App {
        return App.getHotInstance().getValue();
    }

    static getHotInstance(): IHotProperty<App> {
        return hotProperty<App>(new App(), 'App')
    }
}