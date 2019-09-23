import { BasePlatform } from "./BasePlatform";
import Game from "../game/Game";
import { ui } from "../ui/layaMaxUI";
import LoginHttp from "../net/LoginHttp";
import App from "../core/App";
import CookieKey from "../gameCookie/CookieKey";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        // callback && callback("" + Date.now());
        callback && callback("shfdsaomghjgai123fdafda456");
    }

    private cb;
    getUserInfo(callback):void
    {
        this.cb = callback;
        // callback && callback();
        let uu:ui.game.homePageUI = <any>Laya.stage.getChildAt( 0 );
        Laya.stage.once( Laya.Event.CLICK ,this,this.clickFun , [uu.vvv.t1] );
    }

    clickFun( t:Laya.TextInput ):void{
        LoginHttp.FRONT = "test" + t.text;
        Game.cookie.setCookie(CookieKey.USER_ID, { "userId": t.text });
        this.cb && this.cb();
    }

    onShare(callback):void
    {
        callback && callback();
        Game.hero.reborn();
    }
}