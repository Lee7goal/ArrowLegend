export abstract  class BasePlatform{
    abstract checkUpdate():void;
    abstract getUserInfo(callback):void;
    abstract login(callback):void;
    abstract onShare(callback):void;
}