import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";

export default class App{
    static top:number = 10;


    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager;
    static tableManager:TableManager;
    static soundManager:SoundManager;

    static init():void{
        App.layerManager = new LayerManager();
        App.tableManager = new TableManager();
        App.soundManager = new SoundManager();
    }

}