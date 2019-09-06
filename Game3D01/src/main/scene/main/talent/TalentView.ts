import { ui } from "../../../../ui/layaMaxUI";
import TalentCell from "./TalentCell";
import App from "../../../../core/App";
import SysTalentInfo from "../../../sys/SysTalentInfo";
import Session from "../../../Session";
import FlyUpTips from "../../../FlyUpTips";

export default class TalentView extends ui.test.talentUI {
    constructor() { 
        super();
        this.list.vScrollBarSkin = "";
        this.list.itemRender = TalentCell;
        this.list.renderHandler = new Laya.Handler( this , this.renderFun );
        this.on(Laya.Event.DISPLAY,this,this.disFun);
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.btnFun );
    }

    public btnFun():void{
        if( TalentCell.selectId == -1 ){
            FlyUpTips.setTips( "请您先选择一个天赋" );
            return;
        }
        Session.talentData.lvUp( TalentCell.selectId );
    }

    public renderFun(cell:TalentCell , index:number):void{
        cell.setData( this.list.getItem(index) );
    }

    public disFun():void{
        this.refresh();
        this.effect();
    }

    public refresh():void{
        let sysArr = App.tableManager.getTable( SysTalentInfo.NAME );
        let dataArr:Array<any> = [];
        for( let i:number = 0; i < sysArr.length; i+=2 ){
            let a:Array<any> = [];
            a.push( sysArr[i] );
            a.push( sysArr[i+1] );
            dataArr.push(a);
        }
        this.list.array = dataArr;
    }

    private effect():void{
        this.list.mouseEnabled = false;
        let len = this.list.cells.length;
        for( let i :number = 0; i < len; i++ ){
            this.tw( this.list.cells[i] , i * 100 );
        }
        Laya.timer.once( len * 100 + 800 , this, this.mouseFun );
    }

    private mouseFun():void {
        this.list.mouseEnabled = true;
    }

    private tw( cell:Laya.Sprite , delay:number ):void{
        let t = new Laya.Tween();
        t.from( cell , { y: cell.y + this.list.height - cell.height }, 800 + delay , Laya.Ease.backIn,  null  );
    }
}