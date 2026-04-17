import { IHotProperty, hotProperty } from "./hotProperty";

export enum ColorModeType {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export class App {
    public ColorMode: ColorModeType = ColorModeType.DARK;
    public NotLogic: boolean = false;
    public AndLogic: boolean = false;
    public ResumeMode: boolean = true;

    static toggleColorMode() {
        const currentMode = App.Instance.ColorMode;
        App.getHotInstance().setFunc((app) => {
            app.ColorMode = currentMode === ColorModeType.LIGHT ? ColorModeType.DARK : ColorModeType.LIGHT;
            return app;
        });
    }

    static toggleNotLogic() {
        App.getHotInstance().setFunc((app) => {
            app.NotLogic = !app.NotLogic;
            return app;
        });
    }

    static toggleAndLogic() {
        App.getHotInstance().setFunc((app) => {
            app.AndLogic = !app.AndLogic;
            return app;
        });
    }

    static toggleResumeMode() {
        App.getHotInstance().setFunc((app) => {
            app.ResumeMode = !app.ResumeMode;
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