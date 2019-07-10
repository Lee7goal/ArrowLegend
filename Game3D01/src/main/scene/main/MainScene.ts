import { ui } from "../../../ui/layaMaxUI";
import MainUI from "./MainUI";
import MainView from "./MainView";

    export default class MainScene extends ui.test.mainSceneUI {
    private mainUI:MainUI;
    private mainView:MainView;
    
    constructor() { 
        super(); 
        this.initUI();
    }

    private initUI():void{
        this.mainView = new MainView();
        this.addChild(this.mainView);
        this.mainUI = new MainUI();
        this.addChild(this.mainUI);
    }
}