import { BasePlatform } from "./BasePlatform";
import Game from "../game/Game";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        // callback && callback("" + Date.now());
        callback && callback("shfdsaomghjgai123fdafda456");
    }

    getUserInfo(callback):void
    {
        callback && callback();
    }

    onShare(callback):void
    {
        callback && callback();
        Game.hero.reborn();
    }
}