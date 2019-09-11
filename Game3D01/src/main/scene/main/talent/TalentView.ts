import { ui } from "../../../../ui/layaMaxUI";
import TalentCell from "./TalentCell";
import App from "../../../../core/App";
import SysTalentInfo from "../../../sys/SysTalentInfo";
import Session from "../../../Session";
import FlyUpTips from "../../../FlyUpTips";
import GameEvent from "../../../GameEvent";
import { GoldType } from "../../../../game/data/HomeData";
import SysTalentCost from "../../../sys/SysTalentCost";
import SelectTalent from "./SelectTalent";

export default class TalentView extends ui.test.talentUI {

    public dataArr:Array<any> = [];

    constructor() { 
        super();

        this.addData( "tianfu/PTkuang.png" , "tianfu/gongji.png"  , "tianfu/gongzi.png", 1 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/sudu.png"    , "tianfu/yizi.png", 2 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/xingyun.png" , "tianfu/xingzi.png", 3 );
    
        this.addData( "tianfu/JYkuang.png" , "tianfu/fangyu.png" , "tianfu/fangzi.png", 4 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/shengming.png" , "tianfu/shengzi.png", 5 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/jinbi.png" , "tianfu/diaozi.png", 6 );
    
        this.addData( "tianfu/SSkuang.png" , "tianfu/baoji.png" , "tianfu/baozi.png", 7 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/lixian.png" , "tianfu/lizi.png", 8 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/tiejiang.png" , "tianfu/tiezi.png", 9 );

        this.list.itemRender = TalentCell;
        this.on(Laya.Event.DISPLAY,this,this.disFun);
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.btnFun );
        Laya.stage.on(GameEvent.TALENT_UPDATE , this, this.tFun);

        this.list.renderHandler = new Laya.Handler( this,this.renderFun );
        this.list.selectHandler = new Laya.Handler( this,this.selectFun );
    }

    private addData( bg:string , logo:string , font:string, id:number ):void{
        this.dataArr.push( { bg:bg , logo:logo , font:font , id:id } );
    }

    public selectFun(index:number):void{
        if( index == -1 ){
            this.tipBox.visible = false;
            return;
        }
        let lv = Session.talentData.getLv(index);
        if( lv == 0 ){
            this.tipBox.visible = false;
        }else{
            this.tipBox.visible = true;
            let b = this.list.getCell(index);
            //let p = b.localToGlobal( new Laya.Point(0,0) , true , this.dialog.box );
            this.tipBox.x = this.list.x + b.x - 130;
            this.tipBox.y = this.list.y + b.y + 200;
            let sys:SysTalentInfo = App.tableManager.getDataByNameAndId(  SysTalentInfo.NAME, index + 1 );
            this.txt5.text = sys.talentInfo + ":" + Session.talentData.getTxt( index ) + "%";
        }
    }

    public renderFun( cell:ui.test.TianFuCellUI , index:number ):void{
        let obj = this.list.getItem( index );
        cell.logo1.skin = obj.logo;
        cell.bg1.skin = obj.bg;
        cell.txtImg.skin = obj.font;
        let lv = Session.talentData.getLv(index);
        cell.lv.value = lv + "";
        cell.box1.visible = cell.box2.visible = false;
        if( lv == 0 ){
            cell.box2.visible = true;
        }else{
            cell.box1.visible = true;
        } 
        cell.select.visible = (this.list.selectedIndex == index);
    }

    public tFun():void{
        this.refresh();
    }

    public btnFun():void{
        let d = new SelectTalent();
        d.popup(false);
    }

    public disFun():void{
        this.refresh();
        //this.effect();
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
        this.shengmingniu.disabled = !Session.talentData.haveGold();
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