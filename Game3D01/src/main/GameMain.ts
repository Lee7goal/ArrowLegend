import { ui } from "./../ui/layaMaxUI";
import App from "../core/App";
import GameConfig from "../GameConfig";
    export default class GameMain{
    
    constructor(){
        this.init();
    }

    private init():void{
        App.init();
        Laya.stage.addChild(App.layerManager);

        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        console.log("打开场景");
    }
}