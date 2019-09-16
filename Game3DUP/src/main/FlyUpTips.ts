/*
* name;
*/
export default class FlyUpTips extends Laya.Sprite {
    private _txt: Laya.Label;
    private _bg: Laya.Image;
    private static _fly: FlyUpTips;
    constructor() {
        super();
        this._bg = new Laya.Image("main/diban.png");
        this._bg.sizeGrid = "17,16,22,15";
        this.addChild(this._bg);
        this._bg.anchorX = this._bg.anchorY = 0.5;
        this._txt = new Laya.Label();
        this._txt.bold = true;
        this._txt.color = "#ffffff";
        this._txt.fontSize = 20;
        this._txt.align = "CENTER";
        this.addChild(this._txt);
        this._txt.anchorX = this._txt.anchorY = 0.5;
    }

    public setTips(str: string, delay: number, color: string = "#ffffff",isFly?:boolean): void {
        if (str == null || str == "") {
            return;
        }
        Laya.Tween.clearTween(this);
        this._txt.text = str;
        this._txt.color = color;
        this._bg.size(this._txt.textField.textWidth + 200, this._txt.textField.textHeight + 40);
        this.pos(Laya.stage.width * 0.5, Laya.stage.height * 0.5);
        Laya.stage.addChild(this);
        this.alpha = 1;
        if(isFly)
        {
            Laya.Tween.to(this, { y: Laya.stage.height * 0.5 - 200 }, delay, null, Laya.Handler.create(this, this.onCom));
        }
        else
        {
             Laya.Tween.to(this, { alpha:0 }, delay, null, Laya.Handler.create(this, this.onCom),500);
        }
    }

    private onCom(): void {
        this.removeSelf();
        this._txt.text = "";
    }

    public static setTips(str: string, delay: number = 1200, color: string = "#ffffff",isFly:boolean = true): void {
        if (this._fly == null) {
            this._fly = new FlyUpTips();
        }
        this._fly.setTips(str, delay, color,isFly);
    }
}