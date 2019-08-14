import { BasePlatform } from "./BasePlatform";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        callback && callback("tengfei");
    }

    onShare(callback):void
    {

    }
}