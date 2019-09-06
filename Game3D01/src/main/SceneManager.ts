import MainScene from "./scene/main/MainScene";
import BattleScene from "./scene/battle/BattleScene";
import App from "../core/App";
import Game from "../game/Game";

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
        this.battle && this.battle._top && this.battle._top.reset();
    }

    showBattle(): void {
        if (!this.battle)  {
            this.battle = new BattleScene();
        }
        App.layerManager.sceneLayer.removeChildren();
        App.layerManager.sceneLayer.addChild(this.battle);
        Game.playBattleMusic();
    }
}