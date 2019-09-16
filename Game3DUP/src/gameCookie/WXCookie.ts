import { BaseCookie } from "./BaseCookie";

export default class WXCookie extends BaseCookie {
    private wx;
    constructor() {
        super();
        this.wx = Laya.Browser.window.wx;
    }

    setCookie(code: string, data1: any): void {
        this.wx.setStorage({
            key: code,
            data: data1,
            success(res) {
            }
        });
    }

    getCookie(code: string, callback: any): void {
        this.wx.getStorage({
            key: code,
            success(res) {
                callback && callback(res.data);
            },
            fail(res){
                callback && callback(null);
            },
            complete(res){
            }
        })
    }

    removeCookie(code: string):void
    {
        this.wx.removeStorage({
            key: code,
            success (res) {
            }
          })
    }

    clearAll():void
    {
        this.wx.clearStorage();
    }
}