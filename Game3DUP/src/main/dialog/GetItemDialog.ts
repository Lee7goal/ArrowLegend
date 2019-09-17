import { ui } from "../../ui/layaMaxUI";
import RotationEffect from "../../core/utils/RotationEffect";
import GetItemCell from "./GetItemCell";

export default class GetItemDialog extends ui.test.GetItemDialogUI {
    constructor(){
        super();
    }
    
    public now:number = 0;
    public col:number = 3;
    public dArr:Array<any> = [];
    public cellWid:number = 500;
    public cellHei:number = 500;

    public setData( value:any ):void{
        this.now = 0;
        if( value instanceof Array ){
            this.dArr = value;
        }else{
            this.dArr = [value];
        }
        let len = this.dArr.length;
        this.box.width = ( (len >= this.col) ? 3 : len) * this.cellWid;
        this.box.height = Math.ceil( len / this.col ) * this.cellWid;
        
        let sw = 750 / this.box.width;
        this.box.scale( sw,sw );
        
        let wid = this.box.width * this.box.scaleX;
        
        this.rebornBtn.y = this.box.height * sw + 50;

        if( this.rebornBtn.y > ( Laya.stage.height - 80 ) ){
            this.rebornBtn.y = Laya.stage.height - 80;
        }
        this.box.x = (750 - wid)/2;
        Laya.timer.once( 400 ,this,this.effect );
        this.height = this.box.height * sw + 200;
        this.rebornBtn.visible = false;
    }

    public effect():void{
        let v = new GetItemCell();
        v.x = this.now % this.col * this.cellWid + this.cellWid/2;
        v.y = Math.floor(this.now / this.col) * this.cellHei + this.cellHei / 2;
        v.setData(  this.dArr[this.now] );
        this.box.addChild( v );
        this.now++;
        let t = new Laya.Tween();
        t.from( v , {scaleX:3 , scaleY:3 , alpha:0 } , 300 );
        if( this.now < this.dArr.length ){
            Laya.timer.once( 100 , this,this.effect );
        }else{
            this.rebornBtn.visible = true;
        }
    }
}