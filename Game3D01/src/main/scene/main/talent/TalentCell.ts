import { ui } from "../../../../ui/layaMaxUI";
import SysTalentInfo from "../../../sys/SysTalentInfo";

export default class TalentCell extends ui.test.TalentCellUI {
    public static now:ui.test.talent_1UI = null;
    public static selectId:number = -1;

    constructor() {
        super();
    }

    public setData( arr:Array<SysTalentInfo> ):void{
        this.setOne( arr[0] , this.t1 ,this.b1 );
        this.setOne( arr[1] , this.t2 ,this.b2 );
        this.setLv( arr[0].talentUnlock );
    }

    public setOne( sys:SysTalentInfo , t:ui.test.talent_1UI , b:Laya.Box ):void {
        t.select.visible = (t == TalentCell.now);
        if( sys == null ) {
            b.visible = false;
            t.off( Laya.Event.CLICK,this,this.clickFun );
            return;
        }
        b.visible = true;
        t.wenHao.visible = false;
        t.infoBox.visible = true;
        t.jinengming.text = sys.talentInfo;
        t.qianshu2.value = "1";
        
        t.on( Laya.Event.CLICK , this,this.clickFun , [t,sys] );
    }

    public clickFun( t:ui.test.talent_1UI , sys:SysTalentInfo ):void {
        if( TalentCell.now != null ){
            TalentCell.now.select.visible = false;
        }
        TalentCell.now = t;
        t.select.visible = true;
        TalentCell.selectId = sys.id;
    }

    public setLv( lv:number ):void {
        this.dengji0.value = lv + "";
    }
}