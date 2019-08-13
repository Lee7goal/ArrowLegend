import { ui } from "../../../ui/layaMaxUI";
import MainUI from "./MainUI";
import MainView from "./MainView";
import WorldView from "./world/WorldView";
import GameBG from "../../../game/GameBG";
import GameEvent from "../../GameEvent";
import Game from "../../../game/Game";

    export default class MainScene extends Laya.Sprite{
    private mainUI:MainUI;
    private mainView:MainView;
    
    constructor() { 
        super(); 
        this.height = GameBG.height;
        this.initUI();
    }

    private initUI():void{
        this.mainView = new MainView();
        this.mainUI = new MainUI();
        this.addChild(this.mainView);
        this.addChild(this.mainUI);

        Laya.stage.on("switchView",this,this.switchView);
        this.switchView();

        Laya.stage.on(GameEvent.START_BATTLE,this,this.onStartBattle);
    }

    private onStartBattle():void
    {
        this.mainUI.appEnergy();
    }

    private switchView():void{
        this.mainView.selectIndex = this.mainUI.selectIndex;
    }
}