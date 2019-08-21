export default class BitmapNumber extends Laya.FontClip {
    static TAG:string = "BitmapNumber";
    constructor() { 
        super(); 
    }

    update(skin:string,sheet:string,tScale:number):void
    {
        this.skin = skin;
        this.sheet = sheet;
        this.scale(tScale,tScale);
        this.anchorX = this.anchorY = 0.5;
    }

    static getFontClip(tScale:number = 1,skin:string = "main/clipshuzi.png",sheet?:string):BitmapNumber
    {
        let bn:BitmapNumber = Laya.Pool.getItemByClass(BitmapNumber.TAG,BitmapNumber);
        bn.update(skin,sheet ? sheet : "123456 7890-+ /:cdef",tScale ? tScale : 1);
        return bn;
    }

    recover():void
    {
        this.removeSelf();
        Laya.Pool.recover(BitmapNumber.TAG,this);
    }

}