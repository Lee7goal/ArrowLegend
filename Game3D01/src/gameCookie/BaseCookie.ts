export abstract  class BaseCookie{
    abstract setCookie(key:string,data:any):void;
    abstract getCookie(key:string,callback):void;
    abstract removeCookie(key:string):void;
    abstract clearAll():void;
}