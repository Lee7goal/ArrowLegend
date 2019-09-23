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
import TalentCell2 from "./TalentCell2";
import SysTalent from "../../../sys/SysTalent";
import MyEffect from "../../../../core/utils/MyEffect";

export default class TalentView extends ui.test.talentUI {

    public imgArr:Array<string> = ["tianfu/PTkuang.png","tianfu/PTkuang.png","tianfu/PTkuang.png",
    "tianfu/JYkuang.png","tianfu/JYkuang.png","tianfu/JYkuang.png",
    "tianfu/SSkuang.png","tianfu/SSkuang.png","tianfu/SSkuang.png"];

    constructor() { 
        super();
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;

        this.list.itemRender = TalentCell2;
        this.on(Laya.Event.DISPLAY,this,this.disFun);
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.btnFun );
        Laya.stage.on(GameEvent.TALENT_UPDATE , this, this.tFun);

        this.list.renderHandler = new Laya.Handler( this,this.renderFun );
        //this.list.selectHandler = new Laya.Handler( this,this.selectFun );
    }

    public selectFun(index:number):void{
        //console.log( index );
        if( index == -1 ){
            this.tipBox.visible = false;
            return;
        }
        // if( lv == 0 ){
        //     this.tipBox.visible = false;
        // }else{
            this.tipBox.visible = true;
            let b = this.list.getCell(index);
            this.tipBox.x = this.list.x + b.x - 130;
            this.tipBox.y = this.list.y + b.y + 200;
            let arr = SysTalentInfo.getSys();
            let sys = arr[index];
            let tlv = Session.talentData.getLv( sys.id );
            
            let sysT = App.tableManager.getDataByNameAndId( SysTalent.NAME , tlv );
            let vv = sysT[sys.idName];
            this.txt5.text = sys.talentInfo + ":" + vv + "%";
        //}
    }

    public renderFun( cell:TalentCell2 , index:number ):void{
        
        let sys:SysTalentInfo = this.list.getItem( index );
        let obj = Session.talentData.getImgData(sys.id);
        
       
        cell.logo1.skin = obj.logo;
        
        cell.bg1.skin = this.imgArr[index];//obj.bg;//this.imgArr[index]; //obj.bg;

        cell.txtImg.skin = obj.font;
        let lv = Session.talentData.getLv(sys.id);
        cell.lv.value = lv + "";
        cell.box1.visible = cell.box2.visible = false;
        if( lv == 0 ){
            cell.box2.visible = true;
        }else{
            cell.box1.visible = true;
        }
        cell.select.visible = (this.list.selectedIndex == index);
        cell.on(Laya.Event.CLICK,this,this.cellClickFun , [cell, sys.id] );
    }

    private cellClickFun( cell:TalentCell2 , tid:number ):void{
        // if( tlv == 0 ){
        //     this.tipBox.visible = false;
        //     return;
        // }
        let lv = Session.talentData.getLv(tid);
        if( lv == 0 ){
            this.tipBox.visible = false;
            return;
        }

        this.tipBox.visible = true;
        this.tipBox.x = this.list.x + cell.x - 60;
        this.tipBox.y = this.list.y + cell.y + 200;
        let sys:SysTalentInfo = App.tableManager.getDataByNameAndId(  SysTalentInfo.NAME, tid );
        let sysT = App.tableManager.getDataByNameAndId( SysTalent.NAME , lv );
        let vv = sysT[sys.idName];
        this.txt5.text = sys.talentInfo + ":" + vv + sys.getHou();
    }

    public tFun():void{
        this.refresh();
    }

    public btnFun():void{
        if( Session.talentData.canLvUp() == -2 ){
            FlyUpTips.setTips( "请您提升君主等级" );
            return;
        }
        let d = new SelectTalent();
        d.popup(false);
    }

    public disFun():void{
        this.tipBox.visible = false;
        this.refresh();
    }

    public refresh():void{
        let sysArr = SysTalentInfo.getSys();
        this.list.array = sysArr;
        this.shengmingniu.disabled = !Session.talentData.haveGold();
        this.qianshu.value = Session.talentData.getGold() + "";
        //Session.talentData.canLvUp();
        this.lvTime.text = "已升级" + Session.talentData.lvTimes + "次";
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