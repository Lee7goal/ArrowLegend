import IData from "./IData";
import App from "../../core/App";
import SysTalentInfo from "../../main/sys/SysTalentInfo";
import GameEvent from "../../main/GameEvent";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
import SysTalentCost from "../../main/sys/SysTalentCost";
import Equip from "./Equip";

export default class TalentData implements IData {
    
    public talentArr:Array<number> = [];
    /**
     * 默认升级0次
     */
    public lvTimes:number = 0;
    
    public equip:Equip = new Equip();

    public id_name:any = {};
    
    constructor(){
        this.id_name[1] = ["atk","攻击力"];
        this.id_name[2] = ["def","防御力"];
        this.id_name[3] = ["hp","血量"];
        this.id_name[4] = ["hp","血量"];
        this.id_name[5] = ["",""];
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

    /**
     * 升级天赋
     * @param id 
     */
    public lvUp( id:number ):number{
        let lv = this.talentArr[id-1];
        let g = Session.homeData.getGoldByType( GoldType.GOLD );
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        if( g < sys.talentCost ){
            return -1;
        }
        if( this.lvTimes > Session.homeData.level ){
            return -2;
        }
        this.lvTimes++;
        Session.homeData.changeGold( GoldType.GOLD , -sys.talentCost );
        this.talentArr[id-1] = lv + 1;
        App.sendEvent( GameEvent.TALENT_UPDATE );
    }

    public haveGold():boolean{
        let g = Session.homeData.getGoldByType( GoldType.GOLD );
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        return g >= sys.talentCost;
    }
}