export default class MyEffect{
    constructor(){
        
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
        t.from( sp,{scaleX:0.9,scaleY:0.9},80);
    }
}