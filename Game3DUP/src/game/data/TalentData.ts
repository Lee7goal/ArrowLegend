import IData from "./IData";
import App from "../../core/App";
import SysTalentInfo from "../../main/sys/SysTalentInfo";
import GameEvent from "../../main/GameEvent";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
import SysTalentCost from "../../main/sys/SysTalentCost";
import Equip from "./Equip";
import { ui } from "../../ui/layaMaxUI";

export default class TalentData implements IData {
    
    public talentArr:Array<number> = [];
    /**
     * 默认升级0次
     */
    public lvTimes:number = 0;
    public equip:Equip = new Equip();
    public imgArr:Array<any> = [];

    constructor(){
        this.addData( "tianfu/PTkuang.png" , "tianfu/gongji.png"  , "tianfu/gongzi.png", 1 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/shengming.png" , "tianfu/shengzi.png", 2 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/shengming.png" , "tianfu/shengzi.png", 3 );

        this.addData( "tianfu/JYkuang.png" , "tianfu/fangyu.png" , "tianfu/fangzi.png", 4 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/gongji.png" , "tianfu/gongzi.png", 5 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/jinbi.png" , "tianfu/diaozi.png", 6 );

        this.addData( "tianfu/SSkuang.png" , "tianfu/baoji.png" , "tianfu/baozi.png", 7 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/lixian.png" , "tianfu/lizi.png", 8 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/tiejiang.png" , "tianfu/tiezi.png", 9 );
    }

    private addData( bg:string , logo:string , font:string, id:number ):void{
        this.imgArr.push( { bg:bg , logo:logo , font:font , id:id } );
    }

    public getImgData( id:number ):any{
        return this.imgArr[id-1];
    }

    setData(data:any):void{
        if( data.talent == null ){
            this.initData(data);
        }
        let arr = data.talent.split(",");
        for( let k of arr ){
            this.talentArr.push( parseInt(k) );
        }
    }

    saveData(data:any):void{
        data.talent = this.talentArr.join(",");
    }

    initData(data:any):void{
        let sysArr:Array<SysTalentInfo> = App.tableManager.getTable( SysTalentInfo.NAME );
        for( let k of sysArr ){
            this.talentArr.push(0);
        }
    }

    public getLv( id:number ):number {
        return this.talentArr[id-1];
    }

    public getTxt( index:number ):string{
        // if( index == 0 ){
        //     return this.equip.attack + "";
        // }else if( index == 1 ){
        //     return this.equip.move + "";
        // }else if( index == 2 ){
        //     return this.deadLuck + "";
        // }else if( index == 3 ){
        //     return this.equip.defense + "";
        // }else if( index == 4 ){
        //     return this.equip.hitPoint + "";
        // }else if( index == 5 ){
        //     return this.dropGold + "";
        // }else if( index == 6 ){
        //     return this.equip.crit + "";
        // }else if( index == 7 ){
        //     return this.offLineGold + "";
        // }else if( index == 8 ){
        //     return  this.mergeEquip + "";
        // }
        return "";
    }

    public setView( v:ui.test.TianFuCellUI , id:number ):void{
        
    }

    /**
     * 升级天赋
     * @param id 
     */
    public lvUp( id:number ):number{
        let res = this.canLvUp();
        if( res != 0 ){
            return res;
        }
        this.lvTimes++;
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        Session.homeData.changeGold( GoldType.GOLD , -sys.talentCost );
        this.talentArr[id-1] = this.getLv( id ) + 1;
        App.sendEvent( GameEvent.TALENT_UPDATE );
        Session.saveData();
        return res;
    }

    public haveGold():boolean{
        let g = Session.homeData.getGoldByType( GoldType.GOLD );
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        return g >= sys.talentCost;
    }

    public canLvUp():number{
        if( this.haveGold() == false ){
            return -1;
        }
        if( this.lvTimes > Session.homeData.level ){
            return -2;
        }
        return 0;
    }
}