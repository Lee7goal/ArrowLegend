import { ui } from "../../../ui/layaMaxUI";
import MainUI from "./MainUI";
import MainView from "./MainView";
import WorldView from "./world/WorldView";
import GameBG from "../../../game/GameBG";
import GameEvent from "../../GameEvent";
import Game from "../../../game/Game";
import App from "../../../core/App";

    export default class MainScene extends Laya.Sprite{
    private mainUI:MainUI;
    private mainView:MainView;
    
    private verLabel:Laya.Label = new Laya.Label();
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

        this.addChild(this.verLabel);
        this.verLabel.fontSize = 16;
        this.verLabel.color = "#ffffff";
        // this.verLabel.bold = true;
        this.verLabel.text = "version:" + Game.resVer;


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