import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";

export default class App{
    static isTest:number;
    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager;
    static tableManager:TableManager;

    static init():void{
        App.layerManager = new LayerManager();
        App.tableManager = new TableManager();
    }

    static getFontClip(tScale:number = 1,skin:string = "main/clipshuzi.png",sheet?:string):BitmapNumber
    {
        return new BitmapNumber(skin,sheet ? sheet : "123456 7890-+ /:cdef",tScale ? tScale : 1)
    }
}