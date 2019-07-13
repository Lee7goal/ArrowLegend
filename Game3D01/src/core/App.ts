import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";

export default class App{
    static layerManager:LayerManager;
    static tableManager:TableManager;

    static init():void{
        App.layerManager = new LayerManager();
        App.tableManager = new TableManager();
    }
}