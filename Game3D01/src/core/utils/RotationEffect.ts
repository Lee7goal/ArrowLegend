export default class RotationEffect{
    constructor(){
        
    }

    public s:Laya.Sprite;
    public ro:number;

    public rotation(s:Laya.Sprite , ro:number ):void{
        this.s = s;
        this.ro = ro;
        Laya.timer.frameLoop( 1,this, this.loopFun );
        s.once(Laya.Event.UNDISPLAY , this , this.undisFun );
    }

    public undisFun():void{
        Laya.timer.clear( this,this.loopFun );
    }

    public loopFun():void{
        this.s.rotation += this.ro;
    }

    public static play( s:Laya.Sprite , ro:number = 1 ):void{
        let a = new RotationEffect();
        a.rotation(s , ro );
    }
}