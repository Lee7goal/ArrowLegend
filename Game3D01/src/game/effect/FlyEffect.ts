export default class FlyEffect{
    constructor(){

    }

    private static p00Array:Array<Laya.Point> = [];
    private static p00Index:number = 0;
    /**
     * 请确保你的方法内回调其他函数的时候 不会再次调用
     * 因为laya会给他重新赋值 
     * 这个里面有20个
     * 也就是说回调里 连续调用20次 会把第一个重新赋值
     */
    public static getP00():Laya.Point{
        if( FlyEffect.p00Array.length == 0 ){
            for( let i:number = 0; i < 50; i++ ){
                let p = new Laya.Point(0,0);
                FlyEffect.p00Array.push(p);
            }
        }
        if( FlyEffect.p00Index > 49 ){
            FlyEffect.p00Index = 0;
        }
        return FlyEffect.p00Array[FlyEffect.p00Index++].setTo(0,0);
    }

    public start:Laya.Sprite;
    public end:Laya.Sprite;

    public fly( start:Laya.Sprite , end:Laya.Sprite ):void{
        this.start = start;
        this.end = end;
    }

    public flyGold( x1:number,y1:number,gold:number ):void{
        let flyGoldNum: number = 30;
        let goldEvery: number = gold / flyGoldNum;
        for (let i: number = 0; i < flyGoldNum; i++) {
            let img = Laya.Pool.getItem("flygold"); 
            if( img == null ){
                img = new Laya.Image("main/jinbi.png");
            }
            Laya.stage.addChild(img);
            img.scaleX = 1;
            img.scaleY = 1;
            img.x = x1 + Math.random() * 80 - 50;
            img.y = y1 + Math.random() * 80 - 150;
            img.alpha = 0;
            this.flyEffect(img , goldEvery);
        }
    }

    private flyEffect(img: Laya.Image, gold: number): void {
        let p = this.start.localToGlobal( FlyEffect.getP00() );
        let t = new Laya.Tween();
        img.anchorX = img.anchorY = 0.5;
        FlyEffect.BigSmallEffect(img);
        t.to(img, { x: p.x + 10, y: p.y + 10, scaleX: 0.6, scaleY: 0.6 }, 700, Laya.Ease.backIn, new Laya.Handler(this, this.flyGoldOverFun, [img, gold]), Math.random() * 500);
    }

    public static BigSmallEffect( s:Laya.Image ):void{
        s.anchorX = s.anchorY = 0.5;
        let t = new Laya.Tween();
        s.scaleX = s.scaleY = 0.5;
        t.to( s,{ scaleX:0.8,scaleY:0.8,alpha:1,rotation:90 } , 600 , Laya.Ease.backInOut ,null,Math.random() * 100 );
    }

    public flyGoldOverFun(img: Laya.Image, gold: number): void {
        img.removeSelf();
        Laya.Pool.recover( "flygold",img );
        
        let t = new Laya.Tween();
        t.to(this.end , { scaleX: 0.7, scaleY: 0.7 }, 80);

        let t1 = new Laya.Tween();
        t1.to(this.end , { scaleX: 1, scaleY: 1 }, 60, null, null, 80);

        //this.nowGold += gold;

        //this.goldFc.value = parseInt( Math.ceil( this.nowGold ) + "" ) + "";
    }
}