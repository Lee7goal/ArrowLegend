import LayerManager from "./manager/LayerManager";

export default class App{
    static layerManager:LayerManager;

    static init():void{
        App.layerManager = new LayerManager();
    }
}