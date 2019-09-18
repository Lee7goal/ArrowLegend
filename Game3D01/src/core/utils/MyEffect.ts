export default class MyEffect{
    constructor(){
        
    }

    public static rotation( a:Laya.Sprite ,time:number = 100 ):void{
        let t = new Laya.Tween();
        t.repeat = 0;
        
        a.once( Laya.Event.DISPLAY, null , ()=>{
            t.to( a,{rotation:360} , time );    
        } );

        a.once( Laya.Event.UNDISPLAY , null , ()=>{
            Laya.Tween.clearTween( a );
        } );
    }

    public static initBtnEffect():void{
        Laya.stage.on(Laya.Event.CLICK,null,MyEffect.clickFun);
    }

    public static clickFun(e:Laya.Event):void
    {
        if( e.target instanceof Laya.Button ){
            if( e.target.anchorX == 0.5 &&  e.target.anchorY == 0.5){
                MyEffect.clickEffect( e.target );
            }
        }
    }

    public static clickEffect(sp:Laya.Sprite):void{
        let t = new Laya.Tween();
        let s = ( (sp.scaleX > 0) ? 1 : -1);
        t.from( sp,{scaleX:0.9 * s,scaleY:0.9},80);
    }

    public static hide( e:Laya.Sprite , time:number = 500 ):void{
        let t = new Laya.Tween();
        t.to( e,{alpha:0} , time );
    }

    public static show( e:Laya.Sprite , time:number = 500 ):void{
        let t = new Laya.Tween();
        t.to( e,{alpha:1} , time );
    }

    public static flash( e:Laya.Sprite , time:number = 500 ):void{
        let t = new Laya.TimeLine();
        t.to( e , { alpha:0 } , time );
        t.to( e , { alpha:1}  , time );
        t.play(0,true);
        MyEffect.clearTween( e );
    }

    public static clearTween( e:Laya.Sprite ):void{
        e.once( Laya.Event.UNDISPLAY, null , ()=>{
            Laya.Tween.clearAll( e );
        } );
    }
}