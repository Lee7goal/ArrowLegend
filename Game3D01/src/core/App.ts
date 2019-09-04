import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";

export default class App{
    static top:number = 10;


    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager = new LayerManager();
    static tableManager:TableManager = new TableManager();
    static soundManager:SoundManager = new SoundManager();
}