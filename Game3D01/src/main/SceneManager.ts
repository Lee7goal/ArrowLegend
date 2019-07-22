import MainScene from "./scene/main/MainScene";
import BattleScene from "./scene/battle/BattleScene";
import App from "../core/App";

export default class SceneManager {

    constructor() { };

    public main: MainScene;
    public battle: BattleScene;

    showMain(): void {
        if (!this.main)  {
            this.main = new MainScene();
        }
        App.layerManager.sceneLayer.removeChildren();
        App.layerManager.sceneLayer.addChild(this.main);
    }

    showBattle(): void {
        if (!this.battle)  {
            this.battle = new BattleScene();
        }
        App.layerManager.sceneLayer.removeChildren();
        App.layerManager.sceneLayer.addChild(this.battle);
    }
}