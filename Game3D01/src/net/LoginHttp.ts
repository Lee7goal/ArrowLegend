import BaseHttp from "../core/net/BaseHttp";
import App from "../core/App";
import ReceiverHttp from "./ReceiverHttp";
import Session from "../main/Session";
import PlatformID from "../platforms/PlatformID";
import { BasePlatform } from "../platforms/BasePlatform";

/*
* name;
*/
export default class LoginHttp extends BaseHttp {
    
    private jsCode: string;
    constructor(hand:Laya.Handler) {
        super(hand);
    }

    static create(hand:Laya.Handler): LoginHttp {
        return new LoginHttp(hand);
    }

    send(): void {
        super.send(App.serverIP + "gamex3/login", "scode=" + App.platformId + "&jscode=" + this.jsCode, "post", "text");
    }

    onSuccess(data): void {
        Session.SKEY = data;
        super.onSuccess(data);
        console.log("login success",data);
    }
    

    checkLogin(): void {
        let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
        new BP().login((code:string)=>{
            this.jsCode = code;
            this.send();
        });
    }
















    private wxAuthSetting() {
        console.log("wx.getSetting");
        Laya.Browser.window.wx.getSetting({
            success: (res) => {
                console.log(res.authSetting);
                var authSetting = res.authSetting;
                if (authSetting["scope.userInfo"]) {
                    this.wxUserInfo();
                    console.log("已经授权");
                }
                else {
                    console.log("未授权");
                    this.wxUserInfo();
                }
            }
        });
    }

    private wxUserInfo() {
        console.log("wx.createUserInfoButton");
        var button = Laya.Browser.window.wx.createUserInfoButton(
            {
                type: 'text',
                text: '',
                style:
                    {
                        width: Laya.Browser.window.wx.getSystemInfoSync().windowWidth,
                        height: Laya.Browser.window.wx.getSystemInfoSync().windowHeight
                    }
            })
        button.onTap((res) => {
            if (res.errMsg == "getUserInfo:ok") {
                //获取到用户信息
                // wxUserHead = res.userInfo.avatarUrl;
                // wxUserName = res.userInfo.nickName;
                // wxUserSex = res.userInfo.gender;
                // console.log("授权用户信息:" + wxUserName);
                // this.filterEmoji();
                // this.onLogin();
                //清除微信授权按钮
                button.destroy()
            }
            else {
                console.log("授权失败")
            }
        })
    }
}