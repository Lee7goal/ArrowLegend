import { ui } from "../../ui/layaMaxUI";
    export default class GuidePointer extends ui.game.newGuide3UI {
    private imgs:Laya.Image[] = [];
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
    }

    private onDis():void
    {
        this.img0.visible = this.img1.visible = this.img2.visible = false;
        this.imgs = [this.img0,this.img1,this.img2];
        Laya.timer.loop(300,this,this.onLoop);
    }

    private onLoop():void
    {
        if(this.imgs.length > 0)
        {
            let img:Laya.Image = this.imgs.shift();
            img.visible = true;
        }
        else
        {
            this.img0.visible = this.img1.visible = this.img2.visible = false;
            this.imgs = [this.img0,this.img1,this.img2];
        }
    }

    private onUndis():void
    {
        Laya.timer.clear(this,this.onLoop);
    }
}