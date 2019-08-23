import { BaseCookie } from "./BaseCookie";

export default class TestCookie extends BaseCookie {
    constructor() {
        super();
    }

    setCookie(code: string, data: any): void {
        Laya.LocalStorage.setJSON(code, data);
        console.log("setCookie success",code);
    }

    getCookie(code: string, callback: any): void {
        let data = Laya.LocalStorage.getJSON(code);
        console.log("getCookie success", code, data);
        callback && callback(data);
    }

    removeCookie(code: string):void
    {
        Laya.LocalStorage.removeItem(code);
    }

    clearAll():void
    {
        Laya.LocalStorage.clear();
    }
}