export default class DialogManager{
    constructor(){
        
    }

    public dialogMap:any = {};

    public register( dialogName:string , dialogClass:any , res:Array<string> = null ):void{
        this.dialogMap[dialogName] = [dialogClass,res];
    }

    public open( dialogName:string ):void{
        let arr = this.dialogMap[dialogName];
        Laya.loader.load( arr[1] , new Laya.Handler( this,this.loaderFun, [dialogName] ) );
    }

    public loaderFun( dialogName:string ):void{
        let arr = this.dialogMap[dialogName];
        let dc = arr[0];
        let a:Laya.Dialog = new dc();
        a.popup(true,a.isShowEffect);
        a.once( Laya.Event.UNDISPLAY , this,this.undisFun , [a] );
    }

    private undisFun( a:Laya.Dialog ):void{
        a.destroy(true);
    }
}