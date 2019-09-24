export default class FlyEffect{
    constructor(){

    }

    /**
     * 飞几个金币
     */
    public flyNum:number = 30;
    public flySkin:string = "main/jinbi.png";
    public flyTargetHandler:Laya.Handler = null;

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
        let p = this.start.localToGlobal( new Laya.Point( 0 , 0 ) );
        this.flyGold( p.x , p.y , 1 );
    }

    public x1:number = 0;
    public y1:number = 0;
    public ex:number = 0;
    public ey:number = 0;
    

    public goldEvery:number = 0;
    public nowGold:number = 0;
    public fc:Laya.FontClip;
    public flyFromP( x1:number ,y1:number ,end:Laya.Sprite , gold:number , nowGold:number,fc:Laya.FontClip  ):void{
        this.fc = fc;
        this.end = end;
        this.x1 = x1;
        this.y1 = y1;
        this.nowGold = nowGold;
        let p = end.localToGlobal( new Laya.Point(0,0) );
        this.ex = p.x;// + end.width/2;
        this.ey = p.y;// + end.height/2;
        this.flyGold( 0,0,gold );
    }

    public flyGold( x1:number,y1:number, gold:number ):void{
        let flyGoldNum: number = this.flyNum;
        this.goldEvery = gold / flyGoldNum;
        for (let i: number = 0; i < flyGoldNum; i++) {
            let img = null;//Laya.Pool.getItem("flygold"); 
            //if( img == null ){
                img = new Laya.Image(this.flySkin);
            //}
            Laya.stage.addChild(img);
            img.scaleX = 1;
            img.scaleY = 1;
            img.anchorX = img.anchorY = 0.5;
            img.x = this.x1 + Math.random() * 300 - 150;
            img.y = this.y1 + Math.random() * 100 - 50;
            img.alpha = 0;
            this.flyEffect(img , this.goldEvery);
        }
    }

    private flyEffect(img: Laya.Image, gold: number): void {
        //let p = this.start.localToGlobal( FlyEffect.getP00() );
        let p = new Laya.Point( this.x1,this.y1 );
        let t = new Laya.Tween();
        
        //t.to(img, { x: p.x + 10, y: p.y + 10, scaleX: 0.6, scaleY: 0.6 }, 700, Laya.Ease.backIn, new Laya.Handler(this, this.flyGoldOverFun, [img, gold]), Math.random() * 500);
        let delayTime:number = Math.random() * 1000;//, scaleX: 0.6, scaleY: 0.6
        t.to( img , { x: this.ex , y: this.ey ,scaleX:0.5 , scaleY:0.5 }, 700, Laya.Ease.backIn, new Laya.Handler(this, this.flyGoldOverFun, [img, gold]), delayTime + 300 );
        //Laya.timer.once( delayTime , this, this.dFun, [img] , false );
        
        let t1 = new Laya.Tween();
        img.scaleX = img.scaleY = 0;
        img.alpha = 0.0;
        t1.to( img ,{ scaleX:1,scaleY:1,alpha:1 } , 300 , Laya.Ease.backOut , null, delayTime );
    }

    private dFun( img:Laya.Image ):void{
        FlyEffect.BigSmallEffect(img);
    }

    public static BigSmallEffect( s:Laya.Image ):void{
        let t = new Laya.Tween();
        s.scaleX = s.scaleY = 0;
        s.alpha = 0.0;
        t.to( s,{ scaleX:1,scaleY:1,alpha:1 } , 300 , Laya.Ease.backOut );//,Math.random() * 100
    }

    public flyGoldOverFun(img: Laya.Image, gold: number): void {
        img.removeSelf();
        //Laya.Pool.recover( "flygold",img );
        
        let t = new Laya.Tween();
        t.to(this.end , { scaleX: 0.7, scaleY: 0.7 }, 80);

        let t1 = new Laya.Tween();
        t1.to(this.end , { scaleX: 1, scaleY: 1 }, 60, null, null, 80);

        this.nowGold += gold;
        
        if( this.flyTargetHandler == null ){
            this.fc.value = parseInt( Math.ceil( this.nowGold ) + "" ) + "";    
        }else{
            this.flyTargetHandler.runWith( [this.fc ,  this.nowGold ]  );
        }
    }
}