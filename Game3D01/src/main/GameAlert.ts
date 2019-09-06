import { ui } from "./../ui/layaMaxUI";
import App from "../core/App";
    export default class GameAlert extends ui.test.alertUI {
    private handler:Laya.Handler;
    private handler2:Laya.Handler;
    constructor() { 
        super(); 
        this.cancelBtn.clickHandler = new Laya.Handler(this,this.onCancel);
        this.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
    }

    private onCancel():void
    {
        this.removeSelf();
        this.handler2 && this.handler2.run();
    }

    private onSure():void
    {
        this.handler && this.handler.run();
        this.removeSelf();
    }

    onShow(content:string,sureHandler:Laya.Handler,cancelHandler:Laya.Handler = null,content2:string = "",title:string = "提示"):void
    {
        //this.titleTxt.text = title;
        this.txt.text = content;
        this.txt2.text = content2;
        this.handler = sureHandler;
        this.handler2 = cancelHandler;

        App.layerManager.alertLayer.addChild(this);
    }
}