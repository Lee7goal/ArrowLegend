/*
* name;
*/
export default class DisplayUtils{
    constructor(){

    }

    public static addMask(value:number,target:Laya.Sprite):void
    {
        target.scrollRect = new Laya.Rectangle(0,0,value * target.width,target.height);
    }

    public static updateBlood(mo:MaskObj,vv:number,delay:number = 500,wait:number = 100):void
    {
        Laya.Tween.to(mo,{value:vv},delay,null,null,wait);
    }
}

export class MaskObj{
    private rect:Laya.Sprite = new Laya.Sprite();
    private _value:number;
    private _target:Laya.Sprite;
    private _isRight:boolean;
    constructor(target:Laya.Sprite,isRight?:boolean){
        this._target = target;
        this._isRight = isRight;
        this.rect.graphics.drawRect(0,0,target.width,target.height,"#ff0000");
        this._target.mask = this.rect;
    }

    public set value(vv:number)
    {
        this._value = vv;
        var xx:number = 0;
        if(this._isRight)
        {
            xx = this._target.width * (1 - vv);
        }
        this.rect.graphics.clear();
        let ww:number = Math.max(1,this._target.width * vv);
         this.rect.graphics.drawRect(xx,0,ww,this._target.height,"#ff0000");
        this._target.mask = this.rect;
    }

    public get value():number
    {
        return this._value;
    }

}