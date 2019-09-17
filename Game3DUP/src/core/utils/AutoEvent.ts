export default class AutoEvent{
    constructor(){
        
    }

    public setSprite(sp:Laya.Sprite):void{
        sp.on(Laya.Event.DISPLAY,this,this.disFun);
        sp.on(Laya.Event.UNDISPLAY,this,this.undisFun);
    }

    public undisFun():void{
        for( let i:number = 0; i < this.arr.length; i+=3 ){
            Laya.stage.off(  this.arr[i] , this.arr[i+1] , this.arr[i+2] );    
        }
    }

    public disFun():void{
        for( let i:number = 0; i < this.arr.length; i+=3 ){
            Laya.stage.on(  this.arr[i] , this.arr[i+1] , this.arr[i+2] );    
        }
    }
    
    private arr:Array<any> = [];

    public onEvent( e:string , caller: any, listener: Function ):void{
        this.arr.push( e, caller ,listener );
        Laya.stage.on( e,caller ,listener , );
    }
}